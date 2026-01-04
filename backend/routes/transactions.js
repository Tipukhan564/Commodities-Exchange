const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get user transactions
router.get('/', TransactionController.getTransactions);

// Deposit
router.post('/deposit', TransactionController.deposit);

// Withdraw
router.post('/withdraw', TransactionController.withdraw);

module.exports = router;
