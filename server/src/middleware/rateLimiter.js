const rateLimit = require('express-rate-limit');

/**
 * Protects the login endpoint from brute-force attacks.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after some time.' },
});

module.exports = { loginLimiter };
