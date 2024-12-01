const DB = require('../database/database');

exports.loadAssociations = async function () {
  // User - form One-To-Many
  await DB.sequelize.models.User.hasMany(DB.sequelize.models.Form)
  await DB.sequelize.models.Form.belongsTo(DB.sequelize.models.User)

  // Form - GeneralInfo One-To-Many
  await DB.sequelize.models.Form.belongsToMany(DB.sequelize.models.GeneralInfo, { through: DB.sequelize.models.FormGeneralInfo })
  await DB.sequelize.models.GeneralInfo.belongsToMany(DB.sequelize.models.Form, { through: DB.sequelize.models.FormGeneralInfo })

  // Form - Attribute Many-To-Many
  await DB.sequelize.models.Form.belongsToMany(DB.sequelize.models.Attribute, { through: DB.sequelize.models.FormAttribute })
  await DB.sequelize.models.Attribute.belongsToMany(DB.sequelize.models.Form, { through: DB.sequelize.models.FormAttribute })

  // Form - InputQuestion Many-To-Many
  await DB.sequelize.models.Form.belongsToMany(DB.sequelize.models.InputQuestion, { through: DB.sequelize.models.FormInputQuestion })
  await DB.sequelize.models.InputQuestion.belongsToMany(DB.sequelize.models.Form, { through: DB.sequelize.models.FormInputQuestion })

  // Form - ChoiceQuestion Many-To-Many
  await DB.sequelize.models.Form.belongsToMany(DB.sequelize.models.ChoiceQuestion, { through: DB.sequelize.models.FormChoiceQuestion })
  await DB.sequelize.models.ChoiceQuestion.belongsToMany(DB.sequelize.models.Form, { through: DB.sequelize.models.FormChoiceQuestion })

  // Form - Result Many-To-Many
  await DB.sequelize.models.Form.belongsToMany(DB.sequelize.models.Result, { through: DB.sequelize.models.FormResult })
  await DB.sequelize.models.Result.belongsToMany(DB.sequelize.models.Form, { through: DB.sequelize.models.FormResult })

  // ChoiceQuestion - Choice One-To-Many
  await DB.sequelize.models.ChoiceQuestion.hasMany(DB.sequelize.models.Choice)
  await DB.sequelize.models.Choice.belongsTo(DB.sequelize.models.ChoiceQuestion)

  // Choice - AttributeValue One-To-One
  await DB.sequelize.models.Choice.hasOne(DB.sequelize.models.AttributeValue)
  await DB.sequelize.models.AttributeValue.belongsTo(DB.sequelize.models.Choice)

  // Result - AttributeValue One-To-Many
  await DB.sequelize.models.Result.hasMany(DB.sequelize.models.AttributeValue)
  await DB.sequelize.models.AttributeValue.belongsTo(DB.sequelize.models.Result)
}