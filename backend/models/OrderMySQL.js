const pool = require('../config/mysqlDatabase');

class Order {
  static async create({ user_id, commodity_symbol, order_type, quantity, price, total_amount, status = 'COMPLETED' }) {
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, commodity_symbol, order_type, quantity, price, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, commodity_symbol, order_type, quantity, price, total_amount, status]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT o.*, c.name as commodity_name
       FROM orders o
       LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(orderId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0];
  }

  static async getAllOrders() {
    const [rows] = await pool.query(
      `SELECT o.*, u.username, c.name as commodity_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
       ORDER BY o.created_at DESC`
    );
    return rows;
  }

  static async getRecentOrders(userId, limit = 10) {
    const [rows] = await pool.query(
      `SELECT o.*, c.name as commodity_name
       FROM orders o
       LEFT JOIN commodities c ON o.commodity_symbol = c.symbol
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async updateStatus(orderId, status) {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return result;
  }

  static async deleteOrder(orderId) {
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    return result;
  }
}

module.exports = Order;
