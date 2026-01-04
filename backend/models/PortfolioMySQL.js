const pool = require('../config/mysqlDatabase');

class Portfolio {
  static async addOrUpdate({ user_id, commodity_symbol, quantity, average_price, total_invested }) {
    const existing = await this.findByUserAndSymbol(user_id, commodity_symbol);

    if (existing) {
      const newQuantity = parseFloat(existing.quantity) + parseFloat(quantity);
      const newTotalInvested = parseFloat(existing.total_invested) + parseFloat(total_invested);
      const newAveragePrice = newQuantity > 0 ? newTotalInvested / newQuantity : 0;

      await pool.query(
        `UPDATE portfolio
         SET quantity = ?, average_price = ?, total_invested = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND commodity_symbol = ?`,
        [newQuantity, newAveragePrice, newTotalInvested, user_id, commodity_symbol]
      );
      return await this.findByUserAndSymbol(user_id, commodity_symbol);
    } else {
      const [result] = await pool.query(
        `INSERT INTO portfolio (user_id, commodity_symbol, quantity, average_price, total_invested)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, commodity_symbol, quantity, average_price, total_invested]
      );
      return { id: result.insertId };
    }
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name, c.current_price, c.change_percent,
              (p.quantity * c.current_price) as current_value,
              ((p.quantity * c.current_price) - p.total_invested) as profit_loss,
              (((p.quantity * c.current_price) - p.total_invested) / p.total_invested * 100) as profit_loss_percent
       FROM portfolio p
       LEFT JOIN commodities c ON p.commodity_symbol = c.symbol
       WHERE p.user_id = ? AND p.quantity > 0
       ORDER BY p.updated_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findByUserAndSymbol(userId, symbol) {
    const [rows] = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = ? AND commodity_symbol = ?',
      [userId, symbol]
    );
    return rows[0];
  }

  static async updateQuantity(userId, symbol, newQuantity, newAveragePrice, newTotalInvested) {
    if (newQuantity <= 0) {
      const [result] = await pool.query(
        'DELETE FROM portfolio WHERE user_id = ? AND commodity_symbol = ?',
        [userId, symbol]
      );
      return result;
    } else {
      const [result] = await pool.query(
        `UPDATE portfolio
         SET quantity = ?, average_price = ?, total_invested = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND commodity_symbol = ?`,
        [newQuantity, newAveragePrice, newTotalInvested, userId, symbol]
      );
      return result;
    }
  }

  static async deletePosition(userId, symbol) {
    const [result] = await pool.query(
      'DELETE FROM portfolio WHERE user_id = ? AND commodity_symbol = ?',
      [userId, symbol]
    );
    return result;
  }

  static async getTotalValue(userId) {
    const [rows] = await pool.query(
      `SELECT SUM(p.quantity * c.current_price) as total_value
       FROM portfolio p
       LEFT JOIN commodities c ON p.commodity_symbol = c.symbol
       WHERE p.user_id = ?`,
      [userId]
    );
    return rows[0].total_value || 0;
  }
}

module.exports = Portfolio;
