const rateLimit = require('express-rate-limit');

function perUserRateLimit(options = {}) {
  const { windowMs = 60 * 1000, max = 30 } = options;
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      if (req.user && req.user.id) return `user-${req.user.id}`;
      return req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = perUserRateLimit;
