const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');
const { createEnquiry } = require('../controllers/enquiryController');

const router = Router();

// Accept both the snake_case keys sent by the client ContactPage ("customer_name")
// and the camelCase keys used by the enquiry API.
function normalizeBody(req, _res, next) {
  const body = req.body || {};
  if (body.customer_name && !body.customerName) {
    body.customerName = body.customer_name;
  }
  if (body.mobile && !body.phone) {
    body.phone = body.mobile;
  }
  next();
}

router.post(
  '/',
  contactLimiter,
  normalizeBody,
  body('customerName').trim().isLength({ min: 2, max: 150 }).withMessage('Enter your full name (2 to 150 characters).'),
  body('email').trim().isEmail().isLength({ max: 150 }).withMessage('A valid email address is required.'),
  body('phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number.'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required (max 200 characters).'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be at least 10 characters.'),
  validate,
  createEnquiry
);

module.exports = router;