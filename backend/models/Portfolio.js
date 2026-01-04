const db = require('../config/database');

class Portfolio {
  static addOrUpdate({ user_id, commodity_symbol, quantity, average_price, total_invested }) {
    const existing = this.findByUserAndSymbol(user_id, commodity_symbol);

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      const newTotalInvested = existing.total_invested + total_invested;
      const newAveragePrice = newQuantity > 0 ? newTotalInvested / newQuantity : 0;

      const stmt = db.prepare(`
        UPDATE portfolio
        SET quantity = ?, average_price = ?, total_invested = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND commodity_symbol = ?
      `);
      stmt.run(newQuantity, newAveragePrice, newTotalInvested, user_id, commodity_symbol);
      return this.findByUserAndSymbol(user_id, commodity_symbol);
    } else {
      const stmt = db.prepare(`
        INSERT INTO portfolio (user_id, commodity_symbol, quantity, average_price, total_invested)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(user_id, commodity_symbol, quantity, average_price, total_invested);
      return { id: result.lastInsertRowid };
    }
  }

  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT p.*, c.name, c.current_price, c.change_percent,
             (p.quantity * c.current_price) as current_value,
             ((p.quantity * c.current_price) - p.total_invested) as profit_loss,
             (((p.quantity * c.current_price) - p.total_invested) / p.total_invested * 100) as profit_loss_percent
      FROM portfolio p
      LEFT JOIN commodities c ON p.commodity_symbol = c.symbol
      WHERE p.user_id = ? AND p.quantity > 0
      ORDER BY p.updated_at DESC
    `);
    return stmt.all(userId);
  }

  static findByUserAndSymbol(userId, symbol) {
    const stmt = db.prepare('SELECT * FROM portfolio WHERE user_id = ? AND commodity_symbol = ?');
    return stmt.get(userId, symbol);
  }

  static updateQuantity(userId, symbol, newQuantity, newAveragePrice, newTotalInvested) {
    if (newQuantity <= 0) {
      const stmt = db.prepare('DELETE FROM portfolio WHERE user_id = ? AND commodity_symbol = ?');
      return stmt.run(userId, symbol);
    } else {
      const stmt = db.prepare(`
        UPDATE portfolio
        SET quantity = ?, average_price = ?, total_invested = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND commodity_symbol = ?
      `);
      return stmt.run(newQuantity, newAveragePrice, newTotalInvested, userId, symbol);
    }
  }

  static deletePosition(userId, symbol) {
    const stmt = db.prepare('DELETE FROM portfolio WHERE user_id = ? AND commodity_symbol = ?');
    return stmt.run(userId, symbol);
  }

  static getTotalValue(userId) {
    const stmt = db.prepare(`
      SELECT SUM(p.quantity * c.current_price) as total_value
      FROM portfolio p
      LEFT JOIN commodities c ON p.commodity_symbol = c.symbol
      WHERE p.user_id = ?
    `);
    const result = stmt.get(userId);
    return result.total_value || 0;
  }
}

module.exports = Portfolio;
