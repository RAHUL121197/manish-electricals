const rateLimit = require('express-rate-limit');

/**
 * Limits how often the public contact form may be submitted from a single IP.
 * Prevents spam and accidental duplicate submission floods.
 */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submission attempts. Please wait a few minutes and try again.',
  },
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
});

/**
 * Limits admin login attempts to slow down brute forcing.
 */
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait a few minutes and try again.',
  },
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
});

module.exports = { contactLimiter, adminLoginLimiter };