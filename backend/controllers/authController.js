const User = require('../models/UserMySQL');
const Transaction = require('../models/TransactionMySQL');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, full_name } = req.body;

      // Check if user already exists
      const existingUser = User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Create new user
      const userId = User.create({ username, email, password, full_name });

      // Create initial deposit transaction
      Transaction.create({
        user_id: userId,
        transaction_type: 'DEPOSIT',
        amount: 100000,
        description: 'Initial account balance'
      });

      const token = generateToken(userId);
      const user = User.findById(userId);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          balance: user.balance,
          is_admin: user.is_admin
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          balance: user.balance,
          is_admin: user.is_admin
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        balance: user.balance,
        is_admin: user.is_admin,
        created_at: user.created_at
      });
    } catch (err) {
      console.error('Profile fetch error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { full_name, email } = req.body;
      User.updateUser(req.user.id, { full_name, email });

      const updatedUser = User.findById(req.user.id);
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          full_name: updatedUser.full_name,
          balance: updatedUser.balance
        }
      });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = AuthController;
