const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { listEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/', listEmployees);
router.get('/:id', getEmployeeById);
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Employee name is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Email must be valid.'),
  validate,
  createEmployee
);
router.put(
  '/:id',
  body('name').optional().trim().notEmpty().withMessage('Employee name cannot be empty.'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Email must be valid.'),
  validate,
  updateEmployee
);
router.delete('/:id', deleteEmployee);

module.exports = router;
