const db = require('../config/database');

class Watchlist {
  static add(userId, commoditySymbol) {
    try {
      const stmt = db.prepare(`
        INSERT INTO watchlist (user_id, commodity_symbol)
        VALUES (?, ?)
      `);
      const result = stmt.run(userId, commoditySymbol);
      return result.lastInsertRowid;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return null; // Already in watchlist
      }
      throw err;
    }
  }

  static remove(userId, commoditySymbol) {
    const stmt = db.prepare('DELETE FROM watchlist WHERE user_id = ? AND commodity_symbol = ?');
    return stmt.run(userId, commoditySymbol);
  }

  static getByUserId(userId) {
    const stmt = db.prepare(`
      SELECT w.*, c.name, c.current_price, c.change_percent, c.high_price, c.low_price
      FROM watchlist w
      LEFT JOIN commodities c ON w.commodity_symbol = c.symbol
      WHERE w.user_id = ?
      ORDER BY w.added_at DESC
    `);
    return stmt.all(userId);
  }

  static isInWatchlist(userId, commoditySymbol) {
    const stmt = db.prepare('SELECT id FROM watchlist WHERE user_id = ? AND commodity_symbol = ?');
    return stmt.get(userId, commoditySymbol) !== undefined;
  }
}

module.exports = Watchlist;
