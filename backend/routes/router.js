const { authenticated } = require('../middleware/authenticated');
const authController = require('../controllers/authController');
const formController = require('../controllers/formController');

exports.registerRoutes = function (app) {
  /**********
  *   AUTH  *
  ***********/

  // User login
  app.post('/login', authController.handleLogin);

  // User register
  app.post('/register', authController.handleRegister);

  // Issue a new access token if a valid refresh token is provided
  app.get('/refresh_auth', authController.handleRefreshAuth);

  // User logout
  app.get('/logout', authController.handleLogout);


  /**********
  *  FORMS  *
  ***********/

  // Create Form
  app.post('/create_form', authenticated, formController.handleCreateForm);
}