'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var responses = require('./responses/responses');
var cors = require('cors')
const { Sequelize } = require('sequelize');
var models = require('./models/Models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var app = module.exports = express();

// Secret key for signing tokens; keep it secure and do not expose in code.
const JWT_SECRET_KEY = 'your-secure-jw-token-secret-key';

const saltRounds = 10; 

// db

const sequelize = new Sequelize('mysql://tileset:tileset@localhost:3308/tileset')

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

async function syncDatabase(sequelize) {
  await models.defineModels(sequelize);
  await models.syncModels(sequelize);
  await models.saveTestData(sequelize);
  await models.getAllUsers(sequelize);
  await models.updateUsers(sequelize);
  await models.getAllUsers(sequelize);
};

syncDatabase(sequelize);

// middleware

// required to read JSON data in the request
app.use(express.json());
app.use(express.text());

//  allow only frontend
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

function hashPassword(password) {
  const hashedPassword = ""
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      // Handle error
      return;
    }

    // Salt generation successful, proceed to hash the password
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        // Handle error
        return;
      }

      // Hashing successful, 'hash' contains the hashed password
      hashedPassword = hash; 
    });
  });

  return hashedPassword;
}

app.get('/restricted', authenticate, function (req, res) {
  res.status(200).json({ "message": "You are good to go" })
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  sequelize.close()
  server.close(() => {
    debug('HTTP server closed')
  })
})

process.stdin.on('end', function () {
  process.exit(0);
});


// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // const user = await User.findOne({ userId });

    // TODO Check DB and get pass and id
    const user = {}

    if (!user) {
      return res.status(401).json({ code: 401, message: 'Authentication failed: user not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: 'Authentication failed: wrong password' });
    }
    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    const accessToken = jwt.sign({ userId: email }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    // TODO GET USER ID FROM THE REQUEST YOU USED TO GET THE PASSWORD instead of email
    const refreshToken = generateRefreshToken(email)

    // Store Refresh token in DB
    //code in here TODO

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Login failed' });
  }
});

// Function to generate refresh token
function generateRefreshToken(userId) {
  const payload = { userId: userId };

  // Create the token
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30d' });
}

function authenticate(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};