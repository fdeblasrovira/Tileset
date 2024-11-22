const DB = require('../database/database');

exports.handleCreateForm = async function (formData, userId) {
  console.log(formData)
  console.log(userId)
  // Get form data
  // Transaction
  // Register GeneralInfo besides image
  // Register Attribute
  // Register Question
  // Register Result

  try {
    // Use transaction to ensure data integrity
    await DB.sequelize.transaction(async t => {
      // Get User
      const user = await DB.sequelize.models.User.findOne({ where: { id: userId } });

      // Create a user form
      const form = await user.createForm(
        {
          name: formData.generalInfo.formName,
          description: formData.generalInfo.description,
          visibility: formData.generalInfo.visibility == 'public',
          version: 1
        },
        { transaction: t},
      );

      // Prepare attribute data to insert
      const attributestoInsert = formData.attributes.map((attribute, index) => ({
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
      // Keep in mind you need to add form version to question and you need to keep the correct order

      const result = await DB.sequelize.models.Attribute.bulkCreate(attributestoInsert, { transaction: t })
      


    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error.message)
    return { error: true, message: error.message }
  }

  return { error: false };
}

