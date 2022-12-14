const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get token from header
  if (req.header('authorization') === undefined)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const token = req.header('authorization').split('Bearer ')[1];
    // Check if no token
    if (!token)
      return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Verify token

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
