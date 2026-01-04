const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').optional().trim()
], AuthController.register);

// Login
router.post('/login', AuthController.login);

// Get profile (protected)
router.get('/profile', authMiddleware, AuthController.getProfile);

// Update profile (protected)
router.put('/profile', authMiddleware, AuthController.updateProfile);

module.exports = router;
