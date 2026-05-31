const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboard');

router.get('/stats', requireAuth, requireRole('Admin'), dashboardController.stats);

module.exports = router;
