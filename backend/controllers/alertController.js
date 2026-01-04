const Alert = require('../models/Alert');

class AlertController {
  static async getAlerts(req, res) {
    try {
      const alerts = Alert.getByUserId(req.user.id);
      res.json(alerts);
    } catch (err) {
      console.error('Fetch alerts error:', err);
      res.status(500).json({ error: 'Server error fetching alerts' });
    }
  }

  static async createAlert(req, res) {
    try {
      const { commodity_symbol, alert_type, target_price } = req.body;

      if (!commodity_symbol || !alert_type || !target_price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['ABOVE', 'BELOW'].includes(alert_type)) {
        return res.status(400).json({ error: 'Invalid alert type' });
      }

      const alertId = Alert.create({
        user_id: req.user.id,
        commodity_symbol,
        alert_type,
        target_price
      });

      res.status(201).json({
        message: 'Alert created successfully',
        id: alertId
      });
    } catch (err) {
      console.error('Create alert error:', err);
      res.status(500).json({ error: 'Server error creating alert' });
    }
  }

  static async deleteAlert(req, res) {
    try {
      const { id } = req.params;
      Alert.delete(id, req.user.id);

      res.json({ message: 'Alert deleted successfully' });
    } catch (err) {
      console.error('Delete alert error:', err);
      res.status(500).json({ error: 'Server error deleting alert' });
    }
  }

  static async checkAlerts(req, res) {
    try {
      const triggered = Alert.checkAlerts();
      res.json({
        message: 'Alerts checked',
        triggered_count: triggered.length,
        triggered_alerts: triggered
      });
    } catch (err) {
      console.error('Check alerts error:', err);
      res.status(500).json({ error: 'Server error checking alerts' });
    }
  }
}

module.exports = AlertController;
