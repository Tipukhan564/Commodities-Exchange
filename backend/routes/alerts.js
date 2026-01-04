const express = require('express');
const router = express.Router();
const AlertController = require('../controllers/alertController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get alerts
router.get('/', AlertController.getAlerts);

// Create alert
router.post('/', AlertController.createAlert);

// Delete alert
router.delete('/:id', AlertController.deleteAlert);

// Check all alerts (can be called by cron job)
router.post('/check', AlertController.checkAlerts);

module.exports = router;
