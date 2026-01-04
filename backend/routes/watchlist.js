const express = require('express');
const router = express.Router();
const WatchlistController = require('../controllers/watchlistController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get watchlist
router.get('/', WatchlistController.getWatchlist);

// Add to watchlist
router.post('/', WatchlistController.addToWatchlist);

// Remove from watchlist
router.delete('/:commodity_symbol', WatchlistController.removeFromWatchlist);

module.exports = router;
