const jwt = require('jsonwebtoken');

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function checkAuth(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
}

module.exports = checkAuth;
