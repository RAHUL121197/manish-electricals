const { validationResult } = require('express-validator');

/**
 * Runs express-validator checks and returns a clean 400 response
 * with the first validation error message if validation fails.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

module.exports = validate;
