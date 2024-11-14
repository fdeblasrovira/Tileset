const jwt = require('jsonwebtoken');

exports.authenticated = function authenticated(req, res, next) {
  const token = req.header('Authorization').replace("Bearer ", "");;
  console.log("token")
  console.log(token)
  if (!token) return res.status(401).json({ code: 401, message: 'Access denied: no access token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: 'Access denied: invalid access token' });
  }
};