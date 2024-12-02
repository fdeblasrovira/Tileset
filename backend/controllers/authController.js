const authService = require('../services/authService');

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ code: 400, message: 'Bad request: missing login information' });

    const result = await authService.handleLogin(email, password);
    if (result.error) return res.status(401).json({ code: 401, message: 'Authentication failed: invalid credentials' });

    // sets the refresh token as a httponly cookie
    res.cookie('refreshToken', result.refreshToken, {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      path: "/",
      domain: "localhost",
      sameSite: "lax",
      maxAge: 1814400000
    }); // Cookie lasts 21 days

    res.status(200).json({ code: 200, accessToken: result.accessToken });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Login failed' });
  }
};

// User register
exports.handleRegister = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ code: 400, message: 'Bad request: missing registration information' });

    const result = await authService.handleRegister(email, password, fullName);

    // sets the refresh token as a httponly cookie
    res.cookie('refreshToken', result.refreshToken, {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      path: "/",
      domain: "localhost",
      sameSite: "lax",
      maxAge: 1814400000
    }); // Cookie lasts 21 days

    // sends back the access token
    res.status(200).json({ code: 200, accessToken: result.accessToken });
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") return res.status(500).json({ code: 500, message: "UniqueError" });
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Issue a new access token if a valid refresh token is provided
exports.handleRefreshAuth = async function (req, res) {
  try {
    // get the refresh token from the HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ code: 401, message: 'Access denied: no refresh token provided' });

    const result = await authService.handleRefreshAuth(refreshToken);
    if (result.error) return res.status(401).json({ code: 401, message: 'Access denied: invalid refresh token' });

    res.status(200).json({ code: 200, accessToken: result.accessToken });
  }
  catch (e) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// User logout
exports.handleLogout = async function (req, res) {
  const refreshToken = req.cookies.refreshToken;
  // if not refresh token then no need to do anything
  if (!refreshToken) res.status(200).json({ code: 200, message: 'You are not even logged in' })

  try {
    await authService.handleLogout(refreshToken);

    // Unset refresh token cookie
    res.clearCookie("refreshToken");
    res.status(200).json({ code: 200, message: 'Successfully logged out' })
  }
  catch (e) {
    res.status(500).json({ code: 500, message: 'Unable to blacklist' })
  }
};
