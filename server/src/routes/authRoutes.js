const { Router } = require('express');
const { body } = require('express-validator');

const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

const router = Router();

router.post(
  '/login',
  loginLimiter,
  body('loginId').trim().notEmpty().withMessage('Login ID is required.').isLength({ max: 50 }).withMessage('Invalid login ID.'),
  body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be at least 6 characters.'),
  validate,
  authController.login
);

router.get('/me', authenticate, authController.me);

router.post('/logout', authenticate, authController.logout);

router.post(
  '/change-password',
  authenticate,
  body('currentPassword').isLength({ min: 6, max: 100 }).withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6, max: 100 }).withMessage('New password must be at least 6 characters.'),
  validate,
  authController.changePassword
);

module.exports = router;