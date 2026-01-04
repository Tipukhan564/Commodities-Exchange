const pool = require('../config/mysqlDatabase');

class Transaction {
  static async create({ user_id, transaction_type, amount, description }) {
    const [result] = await pool.query(
      `INSERT INTO transactions (user_id, transaction_type, amount, description)
       VALUES (?, ?, ?, ?)`,
      [user_id, transaction_type, amount, description]
    );
    return result.insertId;
  }

  static async getByUserId(userId, limit = 50) {
    const [rows] = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async getAll(limit = 100) {
    const [rows] = await pool.query(
      `SELECT t.*, u.username
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async getByType(userId, type) {
    const [rows] = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = ? AND transaction_type = ?
       ORDER BY created_at DESC`,
      [userId, type]
    );
    return rows;
  }
}

module.exports = Transaction;
