const express = require('express');
const router = express.Router();
const Commodity = require('../models/Commodity');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: '✅ Backend is connected!', timestamp: new Date() });
});

// GET /api/commodities
router.get('/commodities', async (req, res) => {
  try {
    console.log('📡 GET /api/commodities request received');
    const data = await Commodity.find().sort({ date: 1 });
    console.log(`✅ Found ${data.length} commodities`);
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
