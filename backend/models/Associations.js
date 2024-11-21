const DB = require('../database/database');

exports.loadAssociations = async function(){
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

  /* falta
  I think each Choice question has multiple choices. (one to many should do)
  I think each Choice has multiple attribute values. (one to many should do)
  I think each Result also has multiple attribute values. (one to many should do)

  */
  
}