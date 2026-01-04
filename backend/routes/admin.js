const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const TransactionController = require('../controllers/transactionController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users
router.get('/users', AdminController.getAllUsers);

// Get user details
router.get('/users/:id', AdminController.getUserDetails);

// Delete user
router.delete('/users/:id', AdminController.deleteUser);

// Get all orders
router.get('/orders', AdminController.getAllOrders);

// Get all transactions
router.get('/transactions', TransactionController.getAllTransactions);

// Get stats
router.get('/stats', AdminController.getStats);

module.exports = router;
