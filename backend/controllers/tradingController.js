const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const CommodityModel = require('../models/CommodityModel');

class TradingController {
  static async placeBuyOrder(req, res) {
    try {
      const { commodity_symbol, quantity, price } = req.body;
      const userId = req.user.id;

      // Validate inputs
      if (!commodity_symbol || !quantity || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: 'Invalid quantity or price' });
      }

      // Check if commodity exists
      const commodity = CommodityModel.getBySymbol(commodity_symbol);
      if (!commodity) {
        return res.status(404).json({ error: 'Commodity not found' });
      }

      const totalAmount = quantity * price;
      const userBalance = User.getBalance(userId);

      // Check if user has sufficient balance
      if (userBalance < totalAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Deduct balance
      User.updateBalance(userId, -totalAmount);

      // Create order
      const orderId = Order.create({
        user_id: userId,
        commodity_symbol,
        order_type: 'BUY',
        quantity,
        price,
        total_amount: totalAmount,
        status: 'COMPLETED'
      });

      // Update portfolio
      Portfolio.addOrUpdate({
        user_id: userId,
        commodity_symbol,
        quantity,
        average_price: price,
        total_invested: totalAmount
      });

      // Create transaction record
      Transaction.create({
        user_id: userId,
        transaction_type: 'TRADE_BUY',
        amount: totalAmount,
        description: `Bought ${quantity} units of ${commodity.name} at $${price}`
      });

      res.status(201).json({
        message: 'Buy order placed successfully',
        order_id: orderId,
        new_balance: User.getBalance(userId)
      });
    } catch (err) {
      console.error('Buy order error:', err);
      res.status(500).json({ error: 'Server error placing order' });
    }
  }

  static async placeSellOrder(req, res) {
    try {
      const { commodity_symbol, quantity, price } = req.body;
      const userId = req.user.id;

      // Validate inputs
      if (!commodity_symbol || !quantity || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: 'Invalid quantity or price' });
      }

      // Check portfolio
      const position = Portfolio.findByUserAndSymbol(userId, commodity_symbol);
      if (!position || position.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient holdings' });
      }

      const totalAmount = quantity * price;

      // Add balance
      User.updateBalance(userId, totalAmount);

      // Create order
      const orderId = Order.create({
        user_id: userId,
        commodity_symbol,
        order_type: 'SELL',
        quantity,
        price,
        total_amount: totalAmount,
        status: 'COMPLETED'
      });

      // Update portfolio
      const newQuantity = position.quantity - quantity;
      const soldInvestment = (quantity / position.quantity) * position.total_invested;
      const newTotalInvested = position.total_invested - soldInvestment;

      Portfolio.updateQuantity(userId, commodity_symbol, newQuantity, position.average_price, newTotalInvested);

      // Create transaction record
      const commodity = CommodityModel.getBySymbol(commodity_symbol);
      Transaction.create({
        user_id: userId,
        transaction_type: 'TRADE_SELL',
        amount: totalAmount,
        description: `Sold ${quantity} units of ${commodity.name} at $${price}`
      });

      res.status(201).json({
        message: 'Sell order placed successfully',
        order_id: orderId,
        new_balance: User.getBalance(userId)
      });
    } catch (err) {
      console.error('Sell order error:', err);
      res.status(500).json({ error: 'Server error placing order' });
    }
  }

  static async getOrders(req, res) {
    try {
      const orders = Order.findByUserId(req.user.id);
      res.json(orders);
    } catch (err) {
      console.error('Fetch orders error:', err);
      res.status(500).json({ error: 'Server error fetching orders' });
    }
  }

  static async getPortfolio(req, res) {
    try {
      const portfolio = Portfolio.findByUserId(req.user.id);
      const totalValue = Portfolio.getTotalValue(req.user.id);
      const balance = User.getBalance(req.user.id);

      res.json({
        portfolio,
        total_portfolio_value: totalValue,
        cash_balance: balance,
        total_account_value: totalValue + balance
      });
    } catch (err) {
      console.error('Fetch portfolio error:', err);
      res.status(500).json({ error: 'Server error fetching portfolio' });
    }
  }
}

module.exports = TradingController;
