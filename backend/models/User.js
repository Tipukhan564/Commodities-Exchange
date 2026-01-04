const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create({ username, email, password, full_name }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, full_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, email, hashedPassword, full_name);
    return result.lastInsertRowid;
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static updateBalance(userId, amount) {
    const stmt = db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
    return stmt.run(amount, userId);
  }

  static getBalance(userId) {
    const stmt = db.prepare('SELECT balance FROM users WHERE id = ?');
    const result = stmt.get(userId);
    return result ? result.balance : 0;
  }

  static getAllUsers() {
    const stmt = db.prepare('SELECT id, username, email, full_name, balance, is_admin, created_at FROM users');
    return stmt.all();
  }

  static updateUser(id, { full_name, email }) {
    const stmt = db.prepare('UPDATE users SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(full_name, email, id);
  }

  static deleteUser(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = User;
