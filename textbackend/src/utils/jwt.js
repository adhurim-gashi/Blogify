const jwt = require('jsonwebtoken');

// Wrap JWT operations to centralize secret usage and make future rotation easier
const signAccess = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXP || '15m' });
};

const signRefresh = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXP || '7d' });
};

// Expose verification helpers - callers handle thrown errors and map to HTTP responses
const verifyAccess = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefresh = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
