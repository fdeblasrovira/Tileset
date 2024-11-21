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

      // const form = await user.createForm(
      // await user.createForm(
      const form = await user.createForm(
        {
          name: formData.generalInfo.formName,
          description: formData.generalInfo.description,
          visibility: formData.generalInfo.visibility == 'public',
          version: 1
        },
        { transaction: t },
      );
    });
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back
    console.error(error.message)
    return { error: true, message: error.message }
  }

  return { error: false };
}

