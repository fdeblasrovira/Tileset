const { Sequelize } = require('sequelize');
const models = require('../Models');
const DB = require('./database');

exports.initializeDB = async function () {
  const connectionURL = getDBConnectionURL();

  try{
    // Set up sequelize with the Database info 
    const sequelize = new Sequelize(connectionURL, { timezone: process.env.TIMEZONE })
    DB.set(sequelize);

    const connected = await testConnection(DB.get());
    if (!connected) throw new Error("Can't initialize Database")

    await syncDatabase(DB.get());
  }
  catch(e){
    console.log(e)
    throw new Error("Can't initialize Database")
  }
  

}

function getDBConnectionURL() {
  const driver = process.env.DB_DRIVER;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_DATABASE;
  return `${driver}://${user}:${password}@${host}:${port}/${database}`
}

async function syncDatabase(db) {
  await models.defineModels(db);
  await models.syncModels(db);
};

async function testConnection(db) {
  try {
    await db.authenticate();
    return true;
  } catch (error) {
    throw new Error(error.message)
  }
};



