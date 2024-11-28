const DB = require('../database/database');
const { generatePresignedUrl } = require("../aws/S3");
const { Sequelize } = require('sequelize');

exports.handleCreateForm = async function (formData, userId) {
  console.log(formData)
  console.log(userId)

  let formUrl = "";
  const resultUrlArray = []
  try {
    // Use transaction to ensure data integrity
    await DB.sequelize.transaction(async t => {
      // Get User
      const user = await DB.sequelize.models.User.findOne({ where: { id: userId } });

      // Create a user form
      const form = await user.createForm(
        {
          formName: formData.generalInfo.formName,
          description: formData.generalInfo.description,
          visibility: formData.generalInfo.visibility == 'public',
          version: 1
        },
        { transaction: t },
      );

      // Prepare attribute data to insert
      const attributesToInsert = formData.attributes.map((attribute, index) => ({
        leftLabel: attribute.leftLabel,
        rightLabel: attribute.rightLabel,
        leftColor: attribute.leftColor,
        rightColor: attribute.rightColor,
        defaultValue: attribute.defaultValue,
        minValue: attribute.min,
        maxValue: attribute.max,
        order: index,
        formVersion: form.version,
        FormId: form.id
      }))

      // Prepare question data to insert
      // Divide the questions in 2 types: Input questions and choice questions
      const inputQuestions = [], choiceQuestions = [];
      formData.questions.forEach((element, index) => {
        // Add order value
        element.order = index
        if (element.type == "input" || element.type == "textarea" || element.type == "date") inputQuestions.push(element)
        else choiceQuestions.push(element)
      });

      const inputQuestionsToInsert = inputQuestions.map((question, index) => ({
        type: question.type,
        order: question.order,
        label: question.question,
        formVersion: form.version,
        FormId: form.id
      }))

      const choiceQuestionsToInsert = choiceQuestions.map((question, index) => ({
        type: question.type,
        order: question.order,
        label: question.question,
        formVersion: form.version,
        FormId: form.id
      }))

      const attributeResult = await DB.sequelize.models.Attribute.bulkCreate(attributesToInsert, { transaction: t })

      const attributeIdMap = {}
      formData.attributes.forEach((attribute, index) => {
        attributeIdMap[attribute.id] = attributeResult[index].id;
      });


      const inputQuestionResult = await DB.sequelize.models.InputQuestion.bulkCreate(inputQuestionsToInsert, { transaction: t })
      const choiceQuestionResult = await DB.sequelize.models.ChoiceQuestion.bulkCreate(choiceQuestionsToInsert, { transaction: t })


      for (let i = 0; i < choiceQuestionResult.length; ++i) {
        const question = choiceQuestionResult[i];

        // get question order so we can use it as index to get it's options
        const index = question.order;
        const options = formData.questions[index].options;

        // prepare to insert all the options and link it to the question
        const choicesToInsert = options.map((option, index) => ({
          order: index,
          label: option.text,
          ChoiceQuestionId: question.id
        }))

        const choiceResult = await DB.sequelize.models.Choice.bulkCreate(choicesToInsert, { transaction: t })

        const attributeValuesToInsert = []

        // Create the AttributeValue data for each option
        for (let j = 0; j < options.length; ++j) {
          const option = options[j];
          const actionKeys = Object.keys(option.actions)
          // We loop through every action of every option
          for (let k = 0; k < actionKeys.length; ++k) {
            const attribute = actionKeys[k];
            const value = option.actions[attribute];

            // For each attribute and value we create an AttributeValue record
            attributeValuesToInsert.push(
              { attributeId: attributeIdMap[attribute], value: value, ChoiceId: choiceResult[j].id }
            )
          }
        }

        const attributeValueResult = await DB.sequelize.models.AttributeValue.bulkCreate(attributeValuesToInsert, { transaction: t })
      }

      // Prepare results to insert
      const resultsToInsert = formData.results.map((result, index) => ({
        name: result.name,
        description: result.description,
        imageUrl: "urltoImage",
        order: index,
        formVersion: form.version,
        FormId: form.id
      }))

      const resultsResult = await DB.sequelize.models.Result.bulkCreate(resultsToInsert, { transaction: t })

      /* 
       We now create S3 signed URLs so the client can upload their pictures
       We need one URL for the form picture and one URL for each of the results
     */

      // Store all the UPDATE queries
      const resultURLQueries = []

      const bucketName = process.env.S3_IMAGE_BUCKET_NAME;
      // Url is in this format: user/formId/formVersion/
      const formImagePath = `${userId}/${form.id}/${form.version}/`
      const formImageFileName = "form.jpeg"

      // Form picture
      formUrl = await generatePresignedUrl(bucketName, formImagePath + formImageFileName)
      form.imageUrl = formUrl;
      await form.save({ transaction: t })

      // Results pictures
      for (let i = 0; i < resultsResult.length; ++i) {
        const resultId = resultsResult[i].id;

        const generatedURL = await generatePresignedUrl(bucketName, formImagePath + resultId + ".jpeg")

        // TODO Update all results in one query and not one query for every result
        resultsResult[i].imageUrl = generatedURL;
        await resultsResult[i].save({ transaction: t })
        resultUrlArray.push(generatedURL)
      }

      const attributeValuesToInsert = []

      for (let i = 0; i < formData.results.length; ++i) {
        const result = formData.results[i]
        const attributeValues = result.attributeValues

        const attributeKeys = Object.keys(attributeValues)

        for (let j = 0; j < attributeKeys.length; ++j) {
          const attributeId = attributeIdMap[attributeKeys[j]]
          const value = attributeValues[attributeKeys[j]]

          attributeValuesToInsert.push(
            { attributeId: attributeId, value: value, ResultId: resultsResult[i].id }
          )
        }
      }

      const attributeValueResult = await DB.sequelize.models.AttributeValue.bulkCreate(attributeValuesToInsert, { transaction: t })

    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.log(error)
    return { error: true, message: error.message }
  }

  console.log(formUrl, resultUrlArray)
  return { error: false, formImageUpload: formUrl, resultsImageUpload: resultUrlArray };
}

// Get form
exports.handleGetForm = async function (formId, userId, version) {
  let form;
  try {
    form = await DB.sequelize.models.Form.findOne({
      include: [
        {
          association: 'Attributes',
          attributes: { exclude: ['formVersion'] },
          where: {
            formVersion: Sequelize.col('Form.version'),
          }
        },
        {
          association: 'InputQuestions',
          where: {
            formVersion: Sequelize.col('Form.version'),
          },
          required: false
        },
        {
          association: 'ChoiceQuestions',
          where: {
            formVersion: Sequelize.col('Form.version'),
          },
          required: false,
          include: [
            {
              association: 'Choices',
              include: ["AttributeValue"]
            },
          ],
        },
        {
          association: 'Results',
          where: {
            formVersion: Sequelize.col('Form.version'),
          },
          include: [
            {
              association: 'AttributeValues',
            }
          ],
        },
      ],
      where: {
        id: formId,
        version: version ? version : DB.sequelize.fn('MAX', Sequelize.col('version'))
      },
    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error.message)
    return { error: true, message: error.message }
  }

  return { error: false, form: form};
}