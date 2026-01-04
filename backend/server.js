const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize MySQL database
require('./config/mysqlDatabase');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const commodityRoutes = require('./routes/commodities');
const tradingRoutes = require('./routes/trading');
const watchlistRoutes = require('./routes/watchlist');
const alertRoutes = require('./routes/alerts');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/commodities', commodityRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Commodities Exchange API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Commodities Exchange Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});
