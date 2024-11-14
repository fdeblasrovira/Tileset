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

// User register
app.post('/register', async (req, res) => {
  // console.log("req.cookies.refreshToken")
  // console.log(req.cookies.refreshToken)
  try {
    const { email, password, fullName } = req.body;

    const hashedPassword = bcrypt.hashSync(password, process.env.AUTH_SALT_ROUNDS);

    // register the user
    const insertedUser = await sequelize.models.User.create({ fullName: fullName, email: email, passwordHash: hashedPassword, lastConnectionAt: Date.now() })
    const userId = insertedUser.dataValues.id;

    // attempt to login the user by issuing the access and refresh tokens
    const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: '5m',
    });

    const refreshToken = generateRefreshToken(userId)

    // sets the refresh token as a httponly cookie
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      path: "/",
      domain: "localhost",
      sameSite: "lax",
      maxAge: 1814400000
    }); // Cookie lasts 21 days

    // sends back the access token
    res.status(200).json({ code: 200, accessToken: accessToken });
  } catch (error) {
    if (error.name = "SequelizeUniqueConstraintError") res.status(500).json({ code: 500, message: "UniqueError" });
    else res.status(500).json({ code: 500, message: error.message });
  }
});



// Issue a new access token if a valid refresh token is provided
app.get('/refresh_auth', async function (req, res) {
  // get the refresh token from the HttpOnly cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ code: 401, message: 'Access denied: no refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    console.log("decoded")
    console.log(decoded)

    // There is token, but we need to check if it is expired 
    const expiration = decoded.exp;
    const currentTimestamp = new Date().getTime() / 1000;

    if (currentTimestamp >= expiration) {
      // token is expired, need to login again
      res.status(401).json({ code: 401, message: 'Access denied: expired token' });
    }
    else {
      // It's a valid refresh token 
      // Check if it's blacklisted (for example the user logged out)
      const blacklistedToken = await sequelize.models.BlacklistToken.findOne({ where: { token: refreshToken } });

      if (blacklistedToken) {
        // Token is blacklisted, so no it's no longer valid
        res.status(401).json({ code: 401, message: 'Access denied: blacklisted refresh token' });
      }
      else {
        // Token is usable, so create new access token
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_KEY, {
          expiresIn: '5m',
        });
        res.status(200).json({ code: 200, accessToken: accessToken });
      }
    }
  } catch (error) {
    res.status(401).json({ code: 401, message: 'Access denied: invalid refresh token' });
  }
});

app.get('/logout', async function (req, res) {
  const refreshToken = req.cookies.refreshToken;
  // if not refresh token then no need to do anything
  if (!refreshToken) res.status(200).json({ code: 200, message: 'You are not even logged in' })

  try {
    // Get the token expiration date
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    const expiration = decoded.exp;
    // Changing it to milliseconds from seconds
    const expirationDate = new Date(expiration * 1000);

    // Add the token to the blacklist so it will no longer be usable.
    await sequelize.models.BlacklistToken.create({ token: refreshToken, expirationDate })

    // Unset refresh token cookie
    res.clearCookie("refreshToken");
    res.status(200).json({ code: 200, message: 'Successfully logged out' })
  }
  catch (e) {
    res.status(500).json({ code: 500, message: 'Unable to blacklist' })
  }
});

app.get('/restricted', authenticated, function (req, res) {
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


