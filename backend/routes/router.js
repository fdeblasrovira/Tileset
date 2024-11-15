exports.registerRoutes = function (app) {
  // User register
  app.post('/register', async (req, res) => {

  });

  // User login
  app.post('/login', async (req, res) => {

  });

  // Issue a new access token if a valid refresh token is provided
  app.get('/refresh_auth', async function (req, res) {

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
      await DB.get().models.BlacklistToken.create({ token: refreshToken, expirationDate })

      // Unset refresh token cookie
      res.clearCookie("refreshToken");
      res.status(200).json({ code: 200, message: 'Successfully logged out' })
    }
    catch (e) {
      res.status(500).json({ code: 500, message: 'Unable to blacklist' })
    }
  });
}