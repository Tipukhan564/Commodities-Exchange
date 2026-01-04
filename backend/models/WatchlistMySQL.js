const pool = require('../config/mysqlDatabase');

class Watchlist {
  static async add(userId, commoditySymbol) {
    try {
      const [result] = await pool.query(
        'INSERT INTO watchlist (user_id, commodity_symbol) VALUES (?, ?)',
        [userId, commoditySymbol]
      );
      return result.insertId;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return null; // Already in watchlist
      }
      throw err;
    }
  }

  static async remove(userId, commoditySymbol) {
    const [result] = await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND commodity_symbol = ?',
      [userId, commoditySymbol]
    );
    return result;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT w.*, c.name, c.current_price, c.change_percent, c.high_price, c.low_price
       FROM watchlist w
       LEFT JOIN commodities c ON w.commodity_symbol = c.symbol
       WHERE w.user_id = ?
       ORDER BY w.added_at DESC`,
      [userId]
    );
    return rows;
  }

  static async isInWatchlist(userId, commoditySymbol) {
    const [rows] = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = ? AND commodity_symbol = ?',
      [userId, commoditySymbol]
    );
    return rows.length > 0;
  }
}

module.exports = Watchlist;
