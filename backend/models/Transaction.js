const db = require('../config/database');

class Transaction {
  static create({ user_id, transaction_type, amount, description }) {
    const stmt = db.prepare(`
      INSERT INTO transactions (user_id, transaction_type, amount, description)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(user_id, transaction_type, amount, description);
    return result.lastInsertRowid;
  }

  static getByUserId(userId, limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static getAll(limit = 100) {
    const stmt = db.prepare(`
      SELECT t.*, u.username
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  static getByType(userId, type) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ? AND transaction_type = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId, type);
  }
}

module.exports = Transaction;
