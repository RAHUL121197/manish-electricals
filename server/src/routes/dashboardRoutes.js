const { Router } = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

const router = Router();

router.get('/stats', authenticate, requireRole('admin'), getStats);

module.exports = router;