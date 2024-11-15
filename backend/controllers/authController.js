const DB = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await DB.get().models.User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ code: 401, message: 'Authentication failed: email not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.dataValues.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: 'Authentication failed: wrong password' });
    }

    // Create access token
    const accessToken = jwt.sign({ userId: user.dataValues.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '5m',
    });

    // generate refresh token
    const refreshToken = generateRefreshToken(user.dataValues.id)

    // Update last user connection
    user.lastConnectionAt = Date.now()
    user.save()

    // sets the refresh token as a httponly cookie
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      path: "/",
      domain: "localhost",
      sameSite: "lax",
      maxAge: 1814400000
    }); // Cookie lasts 21 days

    res.status(200).json({ code: 200, accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Login failed' });
  }
};


// Function to generate refresh token
function generateRefreshToken(userId) {
  const payload = { userId: userId };

  // Create the token
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
}