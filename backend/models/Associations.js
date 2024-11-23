const DB = require('../database/database');

exports.loadAssociations = async function () {
  // User - form One-To-Many
  await DB.sequelize.models.User.hasMany(DB.sequelize.models.Form)
  await DB.sequelize.models.Form.belongsTo(DB.sequelize.models.User)

  // Form - Attribute One-To-Many
  await DB.sequelize.models.Form.hasMany(DB.sequelize.models.Attribute)
  await DB.sequelize.models.Attribute.belongsTo(DB.sequelize.models.Form)

  // Form - InputQuestion One-To-Many
  await DB.sequelize.models.Form.hasMany(DB.sequelize.models.InputQuestion)
  await DB.sequelize.models.InputQuestion.belongsTo(DB.sequelize.models.Form)

  // Form - ChoiceQuestion One-To-Many
  await DB.sequelize.models.Form.hasMany(DB.sequelize.models.ChoiceQuestion)
  await DB.sequelize.models.ChoiceQuestion.belongsTo(DB.sequelize.models.Form)

  // Form - Result One-To-Many
  await DB.sequelize.models.Form.hasMany(DB.sequelize.models.Result)
  await DB.sequelize.models.Result.belongsTo(DB.sequelize.models.Form)

  // ChoiceQuestion - Choice One-To-Many
  await DB.sequelize.models.ChoiceQuestion.hasMany(DB.sequelize.models.Choice)
  await DB.sequelize.models.Choice.belongsTo(DB.sequelize.models.ChoiceQuestion)

  // Choice - AttributeValue One-To-One
  await DB.sequelize.models.Choice.hasOne(DB.sequelize.models.AttributeValue)
  await DB.sequelize.models.AttributeValue.belongsTo(DB.sequelize.models.Choice)

  // Result - AttributeValue One-To-One
  await DB.sequelize.models.Result.hasMany(DB.sequelize.models.AttributeValue)
  await DB.sequelize.models.AttributeValue.belongsTo(DB.sequelize.models.Result)
}