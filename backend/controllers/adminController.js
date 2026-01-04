const User = require('../models/UserMySQL');
const Order = require('../models/OrderMySQL');
const Transaction = require('../models/TransactionMySQL');
const CommodityModel = require('../models/CommodityMySQL');

class AdminController {
  static async getAllUsers(req, res) {
    try {
      const users = User.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error('Fetch users error:', err);
      res.status(500).json({ error: 'Server error fetching users' });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { id } = req.params;
      const user = User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const orders = Order.findByUserId(id);
      const transactions = Transaction.getByUserId(id, 20);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          balance: user.balance,
          is_admin: user.is_admin,
          created_at: user.created_at
        },
        orders,
        transactions
      });
    } catch (err) {
      console.error('Fetch user details error:', err);
      res.status(500).json({ error: 'Server error fetching user details' });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = Order.getAllOrders();
      res.json(orders);
    } catch (err) {
      console.error('Fetch orders error:', err);
      res.status(500).json({ error: 'Server error fetching orders' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      User.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ error: 'Server error deleting user' });
    }
  }

  static async getStats(req, res) {
    try {
      const users = User.getAllUsers();
      const orders = Order.getAllOrders();
      const commodities = CommodityModel.getAll();
      const transactions = Transaction.getAll(1000);

      const totalVolume = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const buyOrders = orders.filter(o => o.order_type === 'BUY').length;
      const sellOrders = orders.filter(o => o.order_type === 'SELL').length;

      res.json({
        total_users: users.length,
        total_orders: orders.length,
        buy_orders: buyOrders,
        sell_orders: sellOrders,
        total_commodities: commodities.length,
        total_volume: totalVolume,
        total_transactions: transactions.length
      });
    } catch (err) {
      console.error('Fetch stats error:', err);
      res.status(500).json({ error: 'Server error fetching stats' });
    }
  }
}

module.exports = AdminController;
