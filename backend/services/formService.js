const DB = require('../database/database');
const { generatePresignedUrl } = require("../aws/S3");
const { Sequelize, Op } = require('sequelize');
const sortConfig = require('../config/sort');

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
          visibility: formData.generalInfo.visibility == 'public',
          version: 1
        },
        { transaction: t },
      );

      // Prepare to insert general info
      const generalInfoToInsert = {
        formName: formData.generalInfo.formName,
        description: formData.generalInfo.description,
        questionsPerPage: formData.generalInfo.questionsPerPage,
        FormId: form.id
      }

      const generalInfoResult = await DB.sequelize.models.GeneralInfo.create(generalInfoToInsert, { transaction: t })
      await form.addGeneralInfo(generalInfoResult, { through: { version: form.version }, transaction: t });

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
        FormId: form.id
      }))

      const choiceQuestionsToInsert = choiceQuestions.map((question, index) => ({
        type: question.type,
        order: question.order,
        label: question.question,
        FormId: form.id
      }))

      const attributeResult = await DB.sequelize.models.Attribute.bulkCreate(attributesToInsert, { transaction: t })
      await form.addAttributes(attributeResult, { through: { version: form.version }, transaction: t });

      const attributeIdMap = {}
      formData.attributes.forEach((attribute, index) => {
        attributeIdMap[attribute.id] = attributeResult[index].id;
      });


      const inputQuestionResult = await DB.sequelize.models.InputQuestion.bulkCreate(inputQuestionsToInsert, { transaction: t })
      await form.addInputQuestions(inputQuestionResult, { through: { version: form.version }, transaction: t });
      const choiceQuestionResult = await DB.sequelize.models.ChoiceQuestion.bulkCreate(choiceQuestionsToInsert, { transaction: t })
      await form.addChoiceQuestions(choiceQuestionResult, { through: { version: form.version }, transaction: t });


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
        FormId: form.id
      }))

      const resultsResult = await DB.sequelize.models.Result.bulkCreate(resultsToInsert, { transaction: t })
      await form.addResults(resultsResult, { through: { version: form.version }, transaction: t });

      /* 
       We now create S3 signed URLs so the client can upload their pictures
       We need one URL for the form picture and one URL for each of the results
      */

      const bucketName = process.env.S3_IMAGE_BUCKET_NAME;
      // Url is in this format: user/formId/formVersion/
      const formImagePath = `${userId}/${form.id}/${form.version}/`
      const formImageFileName = "form.jpeg"

      // Form picture
      formUrl = await generatePresignedUrl(bucketName, formImagePath + formImageFileName)
      // http://<bucket-name>.s3.<region>.localhost.localstack.cloud:4566/<key-name>
      generalInfoResult.imageUrl = process.env.S3_HOST + bucketName + '/' + formImagePath + formImageFileName;
      await generalInfoResult.save({ transaction: t })

      // Results pictures
      for (let i = 0; i < resultsResult.length; ++i) {
        const resultId = resultsResult[i].id;

        const generatedURL = await generatePresignedUrl(bucketName, formImagePath + resultId + ".jpeg")

        // TODO Update all results in one query and not one query for every result
        resultsResult[i].imageUrl = process.env.S3_HOST + bucketName + '/' + formImagePath + resultId + ".jpeg";
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
exports.handleGetForm = async function (formId, userId = "", version = "") {
  console.log("handleGetForm")
  console.log(formId, userId, version)
  // If there's no UserId, a guest is trying to view the form
  if (!userId) return await getFormGuest(formId);

  // If the version is not provided it means that a logged in user want to see the latest version of form.
  if (!version) return await getFormUser(formId, userId);

  // If we got here, it means that a logged in user want to see a specific version of a form.
  return await getFormVersion(formId, userId, version);
}

// Get the form where the visibility is true (only the latest version has visibility true)
async function getFormGuest(formId) {
  let form;
  try {
    form = await DB.sequelize.models.Form.findOne({
      include: [
        {
          association: 'GeneralInfos',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          }
        },
        {
          association: 'InputQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          },
          required: false
        },
        {
          association: 'ChoiceQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          },
          required: false,
          include: [
            {
              association: 'Choices',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
              }
            },
          ],
        }
      ],
      where: {
        id: formId,
        visibility: true
      },
    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error)
    return { error: true, message: error.message }
  }

  return { error: false, form: form };
}

// Get the form where the visibility is true if the user is not the creator, or get it regardless of visibility if it's the author
async function getFormUser(formId, userId) {
  const whereClause = {
    [Op.or]: [
      {
        [Op.and]: [
          { id: formId },
          { visibility: true },
        ],
      },
      {
        [Op.and]: [
          { id: formId },
          { userId: userId },
        ],
      },
    ],
  };

  let form;
  try {
    form = await DB.sequelize.models.Form.findOne({
      include: [
        {
          association: 'GeneralInfos',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          }
        },
        {
          association: 'InputQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          },
          required: false
        },
        {
          association: 'ChoiceQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          },
          required: false,
          include: [
            {
              association: 'Choices',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
              }
            },
          ],
        }
      ],
      where: whereClause
    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error)
    return { error: true, message: error.message }
  }

  return { error: false, form: form };
}

// Get the form with a specific version (only the creator can see it)
async function getFormVersion(formId, userId, version) {
  const whereClause = {
    [Op.and]: [
      { id: formId },
      { userId: userId },
      { version: version },
    ],
  };

  let form;
  try {
    form = await DB.sequelize.models.Form.findOne({
      include: [
        {
          association: 'GeneralInfos',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [], // Excludes data from the junction table
            where: { version: version }
          }
        },
        {
          association: 'Attributes',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [], // Excludes data from the junction table
            where: { version: version }
          }
        },
        {
          association: 'InputQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [], // Excludes data from the junction table
            where: { version: version }
          },
          required: false
        },
        {
          association: 'ChoiceQuestions',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [], // Excludes data from the junction table
            where: { version: version }
          },
          required: false,
          include: [
            {
              association: 'Choices',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
              },
              include: ["AttributeValue"]
            },
          ],
        },
        {
          association: 'Results',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [], // Excludes data from the junction table
            where: { version: version }
          },
          include: [
            {
              association: 'AttributeValues',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
              },
            }
          ],
        },
      ],
      where: whereClause
    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error)
    return { error: true, message: error.message }
  }

  return { error: false, form: form };
}

// Get the form where the visibility is true (only the latest version has visibility true)
exports.handleGetFormList = async function (userId, searchConditions) {
  console.log(searchConditions)
  const textSearchWhereClause = {
    formName: { [Op.substring]: searchConditions.textSearch ? searchConditions.textSearch : "" }
  }

  let sortClause;
  switch (Number(searchConditions.sort)) {
    case sortConfig.NAME_ASC:
      sortClause = ['GeneralInfos', 'formName', 'ASC']
      break;
    case sortConfig.NAME_DESC:
      sortClause = ['GeneralInfos', 'formName', 'DESC']
      break;
    case sortConfig.POPULARITY_ASC:
      sortClause = []
      break;
    case sortConfig.POPULARITY_DESC:
      sortClause = []
      break;
    case sortConfig.CREATION_DATE_ASC:
      sortClause = ['createdAt', 'ASC']
      break;
    case sortConfig.CREATION_DATE_DESC:
      sortClause = ['createdAt', 'DESC']
      break;
    case sortConfig.MODIFIED_DATE_ASC:
      sortClause = ['updatedAt', 'ASC']
      break;
    case sortConfig.MODIFIED_DATE_DESC:
      sortClause = ['updatedAt', 'DESC']
      break;
    default:
      sortClause = ['updatedAt', 'DESC']
  }
  console.log("sortClause")
  console.log(sortClause)

  let forms, count;
  try {
    const response = await DB.sequelize.models.Form.findAndCountAll({
      attributes: {
        exclude: ['UserId', 'visibility']
      },
      include: [
        {
          association: 'GeneralInfos',
          where: textSearchWhereClause,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          },
          through: {
            attributes: [] // Excludes data from the junction table
          }
        }
      ],
      where: {
        UserId: userId,
        version: {
          [Op.in]: Sequelize.literal("(SELECT MAX(version) FROM Forms AS sub WHERE sub.id = `sub`.`id`)")
        }
      },
      // get only five items each time.
      // The minimum number for page is 1.
      offset: searchConditions.page ? (searchConditions.page - 1) * 5 : 0,
      limit: 5,
      order: [sortClause]
    });

    count = response.count;
    forms = response.rows;
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error)
    return { error: true, message: error.message }
  }

  return { error: false, forms: forms, count: count };
}