'use strict'

/**
 * Module dependencies.
 */
const express = require('express');
const cors = require('cors')
const { Sequelize } = require('sequelize');
const models = require('./models/Models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const initializer = require('./database/initialize')
const DB = require('./database');

// load env variables
require('dotenv').config();

var app = module.exports = express();

// initialize the app
try {
  // DB initialization
  await initializer.initializeDB();

  // Set the middleware
  app.use(express.json());
  app.use(express.text());
  app.use(cookieParser())

  // allow only this app's frontend to access the site
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }))

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
  });
}
catch (e) {
  console.error(e.message)
  process.exit()
}

if (!module.parent) {
  var server = app.listen(3000);
  console.log('Express started on port 3000');
}

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  DB.get().close()
  server.close(() => {
    debug('HTTP server closed')
  })
})

process.stdin.on('end', function () {
  process.exit(0);
});


