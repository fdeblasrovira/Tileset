const Associations = require('./Associations');
const User = require('./User');
const Attribute = require('./Attribute');
const Form = require('./Form');
const Result = require('./Result');
const AttributeValue = require('./AttributeValue');
const BlacklistToken = require('./BlacklistToken');
const InputQuestion = require('./InputQuestion');
const ChoiceQuestion = require('./ChoiceQuestion');
const Choice = require('./Choice');
const GeneralInfo = require('./GeneralInfo');
const FormAttribute = require('./FormAttribute');
const FormInputQuestion = require('./FormInputQuestion');
const FormChoiceQuestion = require('./FormChoiceQuestion');
const FormResult = require('./FormResult');
const FormGeneralInfo = require('./FormGeneralInfo');

// Models to be loaded
const activeModels = [User, Form, Attribute, Result, AttributeValue, BlacklistToken, InputQuestion, ChoiceQuestion, Choice, GeneralInfo, FormAttribute, FormInputQuestion, FormChoiceQuestion, FormResult, FormGeneralInfo];

exports.defineModels = async function (sequelize) {
  activeModels.forEach((activeModel) => {
    sequelize.define(activeModel.model.name, activeModel.model.model, {
      paranoid: activeModel.model.paranoid,
    })
  })
  await Associations.loadAssociations();
}

// Sync the Database with the defined models
exports.syncModels = async function (sequelize) {
  await sequelize.sync({ force: true })
}