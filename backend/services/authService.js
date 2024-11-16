const DB = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.handleLogin = async function (email, password) {
  const user = await DB.sequelize.models.User.findOne({ where: { email: email } });

  if (!user) {
    return { error: true };
  }

  const passwordMatch = await bcrypt.compare(password, user.dataValues.passwordHash);
  if (!passwordMatch) {
    return { error: true };
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

  return { accessToken: accessToken, refreshToken: refreshToken }
}

exports.handleRegister = async function (email, password, fullName) {
  const hashedPassword = bcrypt.hashSync(password, Number(process.env.AUTH_SALT_ROUNDS));

  // register the user
  const insertedUser = await DB.sequelize.models.User.create({ fullName: fullName, email: email, passwordHash: hashedPassword, lastConnectionAt: Date.now() })
  const userId = insertedUser.dataValues.id;

  // attempt to login the user by issuing the access and refresh tokens
  const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '5m',
  });

  const refreshToken = generateRefreshToken(userId)

  return { accessToken: accessToken, refreshToken: refreshToken }
}

exports.handleRefreshAuth = async function (refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    // There is token, but we need to check if it is expired 
    const expiration = decoded.exp;
    const currentTimestamp = new Date().getTime() / 1000;

    if (currentTimestamp >= expiration) {
      // token is expired, need to login again
      return { error: true };
    }
    else {
      // It's a valid refresh token 
      // Check if it's blacklisted (for example the user logged out)
      const blacklistedToken = await DB.sequelize.models.BlacklistToken.findOne({ where: { token: refreshToken } });

      if (blacklistedToken) {
        // Token is blacklisted, so no it's no longer valid
        return { error: true };
      }
      else {
        // Token is usable, so create new access token
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_KEY, {
          expiresIn: '5m',
        });
        return { accessToken: accessToken }

      }
    }
  } catch (error) {
    return { error: true };
  }
}

exports.handleLogout = async function (refreshToken) {
  // Get the token expiration date
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
  const expiration = decoded.exp;
  // Changing it to milliseconds from seconds
  const expirationDate = new Date(expiration * 1000);

  // Add the token to the blacklist so it will no longer be usable.
  await DB.sequelize.models.BlacklistToken.create({ token: refreshToken, expirationDate })
}

// Function to generate refresh token
function generateRefreshToken(userId) {
  const payload = { userId: userId };

  // Create the token
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '21d' });
}