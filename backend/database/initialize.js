const { Sequelize } = require('sequelize');
const Models = require('../Models');

exports.initializeDB = async function () {
  const connectionURL = getDBConnectionURL();

  try{
    
  }
  catch(e){
    console.log(e)
    throw new Error("Can't initialize Database")
  }
  // Set up sequelize with the Database info 
  const sequelize = new Sequelize(connectionURL, { timezone: process.env.TIMEZONE })

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