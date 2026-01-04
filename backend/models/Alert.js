const db = require('../config/database');

class Alert {
  static create({ user_id, commodity_symbol, alert_type, target_price }) {
    const stmt = db.prepare(`
      INSERT INTO price_alerts (user_id, commodity_symbol, alert_type, target_price)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(user_id, commodity_symbol, alert_type, target_price);
    return result.lastInsertRowid;
  }

  static getByUserId(userId) {
    const stmt = db.prepare(`
      SELECT a.*, c.name, c.current_price
      FROM price_alerts a
      LEFT JOIN commodities c ON a.commodity_symbol = c.symbol
      WHERE a.user_id = ? AND a.is_active = 1
      ORDER BY a.created_at DESC
    `);
    return stmt.all(userId);
  }

  static getActiveAlerts() {
    const stmt = db.prepare(`
      SELECT a.*, c.current_price
      FROM price_alerts a
      LEFT JOIN commodities c ON a.commodity_symbol = c.symbol
      WHERE a.is_active = 1
    `);
    return stmt.all();
  }

  static trigger(alertId) {
    const stmt = db.prepare(`
      UPDATE price_alerts
      SET is_active = 0, triggered_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(alertId);
  }

  static delete(alertId, userId) {
    const stmt = db.prepare('DELETE FROM price_alerts WHERE id = ? AND user_id = ?');
    return stmt.run(alertId, userId);
  }

  static checkAlerts() {
    const alerts = this.getActiveAlerts();
    const triggered = [];

    alerts.forEach(alert => {
      const shouldTrigger =
        (alert.alert_type === 'ABOVE' && alert.current_price >= alert.target_price) ||
        (alert.alert_type === 'BELOW' && alert.current_price <= alert.target_price);

      if (shouldTrigger) {
        this.trigger(alert.id);
        triggered.push(alert);
      }
    });

    return triggered;
  }
}

module.exports = Alert;
