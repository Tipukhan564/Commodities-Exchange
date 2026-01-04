const Transaction = require('../models/Transaction');
const User = require('../models/User');

class TransactionController {
  static async getTransactions(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const transactions = Transaction.getByUserId(req.user.id, limit);
      res.json(transactions);
    } catch (err) {
      console.error('Fetch transactions error:', err);
      res.status(500).json({ error: 'Server error fetching transactions' });
    }
  }

  static async deposit(req, res) {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      User.updateBalance(req.user.id, amount);

      Transaction.create({
        user_id: req.user.id,
        transaction_type: 'DEPOSIT',
        amount,
        description: 'Account deposit'
      });

      res.json({
        message: 'Deposit successful',
        new_balance: User.getBalance(req.user.id)
      });
    } catch (err) {
      console.error('Deposit error:', err);
      res.status(500).json({ error: 'Server error processing deposit' });
    }
  }

  static async withdraw(req, res) {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const balance = User.getBalance(req.user.id);
      if (balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      User.updateBalance(req.user.id, -amount);

      Transaction.create({
        user_id: req.user.id,
        transaction_type: 'WITHDRAWAL',
        amount,
        description: 'Account withdrawal'
      });

      res.json({
        message: 'Withdrawal successful',
        new_balance: User.getBalance(req.user.id)
      });
    } catch (err) {
      console.error('Withdrawal error:', err);
      res.status(500).json({ error: 'Server error processing withdrawal' });
    }
  }

  static async getAllTransactions(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const transactions = Transaction.getAll(limit);
      res.json(transactions);
    } catch (err) {
      console.error('Fetch all transactions error:', err);
      res.status(500).json({ error: 'Server error fetching transactions' });
    }
  }
}

module.exports = TransactionController;
