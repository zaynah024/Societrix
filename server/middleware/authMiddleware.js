const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticateUser = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...decodedToken, role: decodedToken.role }; // Attach user role to the request
    next();
  } catch (ex) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};