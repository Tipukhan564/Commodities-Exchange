const pool = require('../config/mysqlDatabase');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, email, password, full_name }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static async updateBalance(userId, amount) {
    const [result] = await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId]);
    return result;
  }

  static async getBalance(userId) {
    const [rows] = await pool.query('SELECT balance FROM users WHERE id = ?', [userId]);
    return rows[0] ? rows[0].balance : 0;
  }

  static async getAllUsers() {
    const [rows] = await pool.query('SELECT id, username, email, full_name, balance, is_admin, created_at FROM users');
    return rows;
  }

  static async updateUser(id, { full_name, email }) {
    const [result] = await pool.query(
      'UPDATE users SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, email, id]
    );
    return result;
  }

  static async deleteUser(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
}

module.exports = User;
