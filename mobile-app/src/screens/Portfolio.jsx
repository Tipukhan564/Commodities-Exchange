import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tradingAPI, commoditiesAPI } from '../services/api';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPackage } from 'react-icons/fi';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commodities, setCommodities] = useState({});

  useEffect(() => {
    fetchPortfolio();
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await commoditiesAPI.getAll();
      const commoditiesMap = {};
      response.data.commodities.forEach((commodity) => {
        commoditiesMap[commodity.id] = commodity;
      });
      setCommodities(commoditiesMap);
    } catch (error) {
      console.error('Failed to fetch commodities:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await tradingAPI.getPortfolio();
      const portfolioData = response.data.portfolio || [];
      setPortfolio(portfolioData);

      // Calculate total values
      let totalVal = 0;
      let totalInv = 0;

      portfolioData.forEach((item) => {
        const currentValue = item.current_price * item.quantity;
        const investment = item.average_price * item.quantity;
        totalVal += currentValue;
        totalInv += investment;
      });

      setTotalValue(totalVal);
      setTotalInvestment(totalInv);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPnL = totalValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-space font-bold gradient-text mb-2">My Portfolio</h1>
        <p className="text-gray-400">Track your commodity holdings and performance</p>
      </motion.div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Value */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Value</p>
              <FiDollarSign className="text-neon-cyan text-xl" />
            </div>
            <h2 className="text-3xl font-bold neon-text-cyan">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </motion.div>

        {/* Total Investment */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-green/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Investment</p>
              <FiPackage className="text-neon-green text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-neon-green">
              ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </motion.div>

        {/* Total P&L */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-dark rounded-2xl p-6 relative overflow-hidden"
        >
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${
              totalPnL >= 0 ? 'bg-profit-green/20' : 'bg-loss-red/20'
            }`}
          ></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total P&L</p>
              {totalPnL >= 0 ? (
                <FiTrendingUp className="text-profit-green text-xl" />
              ) : (
                <FiTrendingDown className="text-loss-red text-xl" />
              )}
            </div>
            <h2
              className={`text-3xl font-bold ${
                totalPnL >= 0 ? 'text-profit-green' : 'text-loss-red'
              }`}
            >
              ${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <p
              className={`text-sm mt-1 ${
                totalPnL >= 0 ? 'text-profit-green' : 'text-loss-red'
              }`}
            >
              {totalPnL >= 0 ? '+' : '-'}
              {Math.abs(totalPnLPercent).toFixed(2)}%
            </p>
          </div>
        </motion.div>
      </div>

      {/* Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-space font-bold mb-4">Holdings</h2>

        {portfolio.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center">
              <FiPackage className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Holdings Yet</h3>
            <p className="text-gray-400 mb-6">
              Start trading to build your commodity portfolio
            </p>
            <motion.a
              href="/trade"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-green text-cyber-dark font-bold shadow-neon-cyan"
            >
              Start Trading
            </motion.a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => {
              const commodity = commodities[item.commodity_id];
              const currentValue = item.current_price * item.quantity;
              const investment = item.average_price * item.quantity;
              const pnl = currentValue - investment;
              const pnlPercent = (pnl / investment) * 100;

              return (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03 }}
                  className="glass-dark rounded-2xl p-6 card-hover relative overflow-hidden"
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl ${
                      pnl >= 0 ? 'bg-profit-green/20' : 'bg-loss-red/20'
                    }`}
                  ></div>

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {commodity?.name || item.commodity_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {commodity?.symbol || item.commodity_symbol}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          pnl >= 0
                            ? 'bg-profit-green/20 text-profit-green'
                            : 'bg-loss-red/20 text-loss-red'
                        }`}
                      >
                        {pnl >= 0 ? '+' : ''}
                        {pnlPercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Quantity</span>
                        <span className="font-mono font-bold">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Avg Price</span>
                        <span className="font-mono">
                          ${item.average_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Current Price</span>
                        <span className="font-mono text-neon-cyan">
                          ${item.current_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Value</span>
                        <span className="font-mono font-bold text-lg text-neon-green">
                          ${currentValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">P&L</span>
                        <span
                          className={`font-mono font-bold ${
                            pnl >= 0 ? 'text-profit-green' : 'text-loss-red'
                          }`}
                        >
                          {pnl >= 0 ? '+' : ''}$
                          {Math.abs(pnl).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Portfolio;
