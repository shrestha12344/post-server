const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    jwt.verify(token, '$$$');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
