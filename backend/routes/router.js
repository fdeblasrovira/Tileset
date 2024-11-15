const authController = require('../controllers/authController');

exports.registerRoutes = function (app) {
  /**********
  *   AUTH  *
  ***********/
 
  // User login
  app.post('/login', authController.handleLogin);

  // User register
  app.post('/register', authController.handleLogin);

  // Issue a new access token if a valid refresh token is provided
  app.get('/refresh_auth', authController.handleLogin);

  // User logout
  app.get('/logout', authController.handleLogin);
}