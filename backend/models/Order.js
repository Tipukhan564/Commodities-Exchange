const db = require('../config/database');

class Order {
  static create({ user_id, commodity_symbol, order_type, quantity, price, total_amount, status = 'COMPLETED' }) {
    const stmt = db.prepare(`
      INSERT INTO orders (user_id, commodity_symbol, order_type, quantity, price, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(user_id, commodity_symbol, order_type, quantity, price, total_amount, status);
    return result.lastInsertRowid;
  }

  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT o.*, c.name as commodity_name
      FROM orders o
      LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `);
    return stmt.all(userId);
  }

  static findById(orderId) {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    return stmt.get(orderId);
  }

  static getAllOrders() {
    const stmt = db.prepare(`
      SELECT o.*, u.username, c.name as commodity_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
      ORDER BY o.created_at DESC
    `);
    return stmt.all();
  }

  static getRecentOrders(userId, limit = 10) {
    const stmt = db.prepare(`
      SELECT o.*, c.name as commodity_name
      FROM orders o
      LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static updateStatus(orderId, status) {
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    return stmt.run(status, orderId);
  }

  static deleteOrder(orderId) {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    return stmt.run(orderId);
  }
}

module.exports = Order;
