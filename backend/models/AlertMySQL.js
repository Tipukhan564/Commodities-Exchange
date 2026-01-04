const pool = require('../config/mysqlDatabase');

class Alert {
  static async create({ user_id, commodity_symbol, alert_type, target_price }) {
    const [result] = await pool.query(
      `INSERT INTO price_alerts (user_id, commodity_symbol, alert_type, target_price)
       VALUES (?, ?, ?, ?)`,
      [user_id, commodity_symbol, alert_type, target_price]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT a.*, c.name, c.current_price
       FROM price_alerts a
       LEFT JOIN commodities c ON a.commodity_symbol = c.symbol
       WHERE a.user_id = ? AND a.is_active = 1
       ORDER BY a.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getActiveAlerts() {
    const [rows] = await pool.query(
      `SELECT a.*, c.current_price
       FROM price_alerts a
       LEFT JOIN commodities c ON a.commodity_symbol = c.symbol
       WHERE a.is_active = 1`
    );
    return rows;
  }

  static async trigger(alertId) {
    const [result] = await pool.query(
      'UPDATE price_alerts SET is_active = 0, triggered_at = CURRENT_TIMESTAMP WHERE id = ?',
      [alertId]
    );
    return result;
  }

  static async delete(alertId, userId) {
    const [result] = await pool.query(
      'DELETE FROM price_alerts WHERE id = ? AND user_id = ?',
      [alertId, userId]
    );
    return result;
  }

  static async checkAlerts() {
    const alerts = await this.getActiveAlerts();
    const triggered = [];

    for (const alert of alerts) {
      const shouldTrigger =
        (alert.alert_type === 'ABOVE' && alert.current_price >= alert.target_price) ||
        (alert.alert_type === 'BELOW' && alert.current_price <= alert.target_price);

      if (shouldTrigger) {
        await this.trigger(alert.id);
        triggered.push(alert);
      }
    }

    return triggered;
  }
}

module.exports = Alert;
