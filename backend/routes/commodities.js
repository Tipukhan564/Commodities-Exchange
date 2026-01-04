const express = require('express');
const router = express.Router();
const CommodityController = require('../controllers/commodityController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: '✅ Backend is connected!', timestamp: new Date() });
});

// Get all commodities (public)
router.get('/', CommodityController.getAllCommodities);

// Get commodity by symbol (public)
router.get('/:symbol', CommodityController.getCommodityBySymbol);

// Update commodity price (admin only)
router.put('/:symbol', authMiddleware, adminMiddleware, CommodityController.updateCommodityPrice);

// Create commodity (admin only)
router.post('/', authMiddleware, adminMiddleware, CommodityController.createCommodity);

// Delete commodity (admin only)
router.delete('/:symbol', authMiddleware, adminMiddleware, CommodityController.deleteCommodity);

module.exports = router;
