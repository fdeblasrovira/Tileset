const User = require('./User');
const Attribute = require('./Attribute');
const Form = require('./Form');
const Result = require('./Result');
const AttributeValue = require('./AttributeValue');
const BlacklistToken = require('./BlacklistToken');
const InputQuestion = require('./InputQuestion');
const ChoiceQuestion = require('./ChoiceQuestion');

// Models to be loaded
const activeModels = [User, Attribute, Form, Result, AttributeValue, BlacklistToken, InputQuestion, ChoiceQuestion];

exports.defineModels = async function (sequelize) {
  activeModels.forEach((activeModel) => {
    sequelize.define(activeModel.model.name, activeModel.model.model, { paranoid: activeModel.model.paranoid })
  })
}

// Sync the Database with the defined models
exports.syncModels = async function (sequelize) {
  await sequelize.sync({ force: true })
}