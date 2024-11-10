'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var responses = require('./responses/responses');
var hash = require('pbkdf2-password')()
var session = require('express-session');
var cors = require('cors')

var app = module.exports = express();

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

app.use(session({
  name: "tileset-session-data",
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: {
    secure: true, // required for cookies to work on HTTPS
    httpOnly: false,
    sameSite: 'none'
  }
}));

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(responses.UNAUTHORIZED.code).json(responses.UNAUTHORIZED)
  }
}

// Session-persisted message middleware

// app.use(function (req, res, next) {
//   var err = req.session.error;
//   var msg = req.session.success;
//   delete req.session.error;
//   delete req.session.success;
//   res.locals.message = '';
//   if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
//   if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
//   next();
// });

// dummy database

var users = {
  tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;
  users.tj.hash = hash;
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

app.get('/restricted', restrict, function (req, res) {
  res.status(200).json({ "message": "You are good to go" })
});

app.get('/logout', function (req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy();
  res.status(200).send()
});

app.post('/login', function (req, res, next) {
  if (!req.body) return res.status(400)
  console.log(req.body)
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        res.status(responses.OK.code).json(responses.OK)
      });
    } else {
      res.status(responses.UNAUTHORIZED.code).json(responses.UNAUTHORIZED)
    }
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})