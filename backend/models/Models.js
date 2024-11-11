const User = require('./User');
const Attribute = require('./Attribute');
const Form = require('./Form');
const Result = require('./Result');
const ResultAttributeValue = require('./ResultAttributeValue');

// Models to be loaded
const activeModels = [User, Attribute, Form, Result, ResultAttributeValue];

exports.defineModels = async function (sequelize) {
  activeModels.forEach((activeModel) => {
    sequelize.define(activeModel.model.name, activeModel.model.model, {paranoid: true})
  })
}

// Sync the Database with the defined models
exports.syncModels = async function (sequelize) {
  await sequelize.sync({ force: true })
}

exports.saveTestData = async function (sequelize) {
  await sequelize.models.User.create({fullName: "ferran de Blas", email: "test@gmail.com", passwordHash: "testHash123456890", passwordSalt: "testHashSalt123456890"})
}

exports.getAllUsers = async function (sequelize) {
  // const users = await sequelize.models.User.findAll();
  // console.log('All users:', JSON.stringify(users, null, 2));

  // const users = await sequelize.models.User.findAll({attributes: ['fullName', 'email']});
  // console.log('All users:', JSON.stringify(users, null, 2));

  const users = await sequelize.models.User.findAll({where: {fullname: "ferran de Blas"}, attributes: ['email']});
  console.log('All users:', JSON.stringify(users, null, 2));
}

exports.updateUsers = async function (sequelize) {
  await sequelize.models.User.update(
    { email: 'edited@Value.com' },
    {
      where: {
        fullname: "ferran de Blas",
      },
    },
  );
}