const express = require('express');
const router = express.Router();
const TradingController = require('../controllers/tradingController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Place buy order
router.post('/buy', TradingController.placeBuyOrder);

// Place sell order
router.post('/sell', TradingController.placeSellOrder);

// Get user's orders
router.get('/orders', TradingController.getOrders);

// Get user's portfolio
router.get('/portfolio', TradingController.getPortfolio);

module.exports = router;
