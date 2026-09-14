const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createEnquiry, listEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry } = require('../controllers/enquiryController');

const router = Router();

router.post(
  '/',
  body('customerName').trim().notEmpty().withMessage('Customer name is required.'),
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Mobile number is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.'),
  validate,
  createEnquiry
);

router.get('/', authenticate, requireRole('admin'), listEnquiries);
router.get('/:id', authenticate, requireRole('admin'), getEnquiryById);
router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  body('status').optional().isIn(['new', 'contacted', 'closed']).withMessage('Status is invalid.'),
  validate,
  updateEnquiry
);
router.delete('/:id', authenticate, requireRole('admin'), deleteEnquiry);

module.exports = router;
