const Watchlist = require('../models/Watchlist');

class WatchlistController {
  static async getWatchlist(req, res) {
    try {
      const watchlist = Watchlist.getByUserId(req.user.id);
      res.json(watchlist);
    } catch (err) {
      console.error('Fetch watchlist error:', err);
      res.status(500).json({ error: 'Server error fetching watchlist' });
    }
  }

  static async addToWatchlist(req, res) {
    try {
      const { commodity_symbol } = req.body;

      if (!commodity_symbol) {
        return res.status(400).json({ error: 'Commodity symbol required' });
      }

      const result = Watchlist.add(req.user.id, commodity_symbol);

      if (result === null) {
        return res.status(400).json({ error: 'Already in watchlist' });
      }

      res.status(201).json({
        message: 'Added to watchlist successfully',
        id: result
      });
    } catch (err) {
      console.error('Add to watchlist error:', err);
      res.status(500).json({ error: 'Server error adding to watchlist' });
    }
  }

  static async removeFromWatchlist(req, res) {
    try {
      const { commodity_symbol } = req.params;
      Watchlist.remove(req.user.id, commodity_symbol);

      res.json({ message: 'Removed from watchlist successfully' });
    } catch (err) {
      console.error('Remove from watchlist error:', err);
      res.status(500).json({ error: 'Server error removing from watchlist' });
    }
  }
}

module.exports = WatchlistController;
