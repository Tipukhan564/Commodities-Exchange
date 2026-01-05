import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commoditiesAPI, tradingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
} from 'react-icons/fi';

const Trading = () => {
  const { user } = useAuth();
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await commoditiesAPI.getAll();
      const commoditiesData = response.data.commodities || [];
      setCommodities(commoditiesData);
      if (commoditiesData.length > 0) {
        setSelectedCommodity(commoditiesData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch commodities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedCommodity || !quantity || parseFloat(quantity) <= 0) {
      showNotification('error', 'Please enter a valid quantity');
      return;
    }

    setPlacing(true);

    try {
      const orderData = {
        commodity_id: selectedCommodity.id,
        order_type: orderType,
        quantity: parseFloat(quantity),
        price: selectedCommodity.current_price,
      };

      await tradingAPI.placeOrder(orderData);

      showNotification(
        'success',
        `${orderType === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`
      );

      setQuantity('');
    } catch (error) {
      showNotification(
        'error',
        error.response?.data?.message || 'Failed to place order'
      );
    } finally {
      setPlacing(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const totalCost = selectedCommodity && quantity
    ? selectedCommodity.current_price * parseFloat(quantity || 0)
    : 0;

  const filteredCommodities = commodities.filter(
    (commodity) =>
      commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">Loading Trading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 max-w-md w-full"
          >
            <div
              className={`glass-dark rounded-2xl p-4 flex items-center space-x-3 ${
                notification.type === 'success'
                  ? 'border border-profit-green/50'
                  : 'border border-loss-red/50'
              }`}
            >
              {notification.type === 'success' ? (
                <FiCheckCircle className="text-profit-green text-2xl flex-shrink-0" />
              ) : (
                <FiAlertCircle className="text-loss-red text-2xl flex-shrink-0" />
              )}
              <p className="text-white">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-space font-bold gradient-text mb-2">
          Trade Commodities
        </h1>
        <p className="text-gray-400">Buy and sell commodities in real-time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commodities List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-dark rounded-2xl p-4 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Select Commodity</h2>

            {/* Search */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass border border-white/10 focus:border-neon-cyan outline-none text-sm"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredCommodities.map((commodity) => (
                <motion.button
                  key={commodity.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCommodity(commodity)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedCommodity?.id === commodity.id
                      ? 'glass border border-neon-cyan shadow-neon-cyan'
                      : 'hover:glass'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-bold text-sm">{commodity.symbol}</p>
                      <p className="text-xs text-gray-400">{commodity.name}</p>
                    </div>
                    {commodity.price_change_24h >= 0 ? (
                      <FiTrendingUp className="text-profit-green" />
                    ) : (
                      <FiTrendingDown className="text-loss-red" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-mono font-bold text-sm">
                      ${commodity.current_price.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        commodity.price_change_24h >= 0
                          ? 'text-profit-green'
                          : 'text-loss-red'
                      }`}
                    >
                      {commodity.price_change_24h >= 0 ? '+' : ''}
                      {commodity.price_change_24h.toFixed(2)}%
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trading Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedCommodity && (
            <>
              {/* Commodity Info */}
              <div className="glass-dark rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {selectedCommodity.name}
                    </h2>
                    <p className="text-gray-400">{selectedCommodity.symbol}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl ${
                      selectedCommodity.price_change_24h >= 0
                        ? 'bg-profit-green/20 text-profit-green'
                        : 'bg-loss-red/20 text-loss-red'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {selectedCommodity.price_change_24h >= 0 ? (
                        <FiTrendingUp />
                      ) : (
                        <FiTrendingDown />
                      )}
                      <span className="font-bold">
                        {selectedCommodity.price_change_24h >= 0 ? '+' : ''}
                        {selectedCommodity.price_change_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-5xl font-bold neon-text-cyan font-mono mb-6">
                  ${selectedCommodity.current_price.toFixed(2)}
                </h1>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">24h High</p>
                    <p className="font-mono font-bold text-profit-green">
                      ${selectedCommodity.high_24h?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">24h Low</p>
                    <p className="font-mono font-bold text-loss-red">
                      ${selectedCommodity.low_24h?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Volume</p>
                    <p className="font-mono font-bold">
                      ${(selectedCommodity.volume_24h || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FiShoppingCart className="text-neon-cyan text-2xl" />
                  <h3 className="text-2xl font-bold">Place Order</h3>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  {/* Order Type Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Order Type
                    </label>
                    <div className="flex glass rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setOrderType('buy')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                          orderType === 'buy'
                            ? 'bg-profit-green text-cyber-dark shadow-neon-green'
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FiTrendingUp />
                          <span>BUY</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('sell')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                          orderType === 'sell'
                            ? 'bg-loss-red text-white shadow-neon-red'
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FiTrendingDown />
                          <span>SELL</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Quantity
                    </label>
                    <div className="relative">
                      <FiShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan" />
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl glass border border-white/10 focus:border-neon-cyan focus:shadow-neon-cyan transition-all outline-none text-lg font-mono"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Price per unit</span>
                      <span className="font-mono font-bold">
                        ${selectedCommodity.current_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Quantity</span>
                      <span className="font-mono font-bold">
                        {quantity || '0.00'}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Cost</span>
                        <span className="text-2xl font-mono font-bold text-neon-green">
                          ${totalCost.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Available Balance */}
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-400 flex items-center space-x-2">
                      <FiDollarSign className="text-neon-cyan" />
                      <span>Available Balance</span>
                    </span>
                    <span className="font-mono font-bold text-neon-cyan">
                      ${(user?.balance || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={placing || !quantity || parseFloat(quantity) <= 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 ${
                      orderType === 'buy'
                        ? 'bg-gradient-to-r from-profit-green to-neon-green text-cyber-dark shadow-neon-green'
                        : 'bg-gradient-to-r from-loss-red to-neon-red text-white shadow-neon-red'
                    }`}
                  >
                    {placing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Order...
                      </div>
                    ) : (
                      `${orderType === 'buy' ? 'BUY' : 'SELL'} ${
                        selectedCommodity.symbol
                      }`
                    )}
                  </motion.button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Trading;
