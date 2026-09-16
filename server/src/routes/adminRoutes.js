const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { adminLoginLimiter } = require('../middleware/rateLimiter');
const { login } = require('../controllers/adminController');

const router = Router();

// Login for the env-configured admin account. Issues a short-lived JWT with
// role 'admin' so the existing admin-protected routes accept it.
router.post(
  '/login',
  adminLoginLimiter,
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
  login
);

module.exports = router;