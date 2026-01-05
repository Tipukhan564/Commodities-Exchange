import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tradingAPI, commoditiesAPI } from '../services/api';
import {
  FiList,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiFilter,
} from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [commodities, setCommodities] = useState({});

  useEffect(() => {
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const response = await tradingAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await tradingAPI.cancelOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'completed':
        return <FiCheckCircle className="text-profit-green" />;
      case 'cancelled':
        return <FiXCircle className="text-loss-red" />;
      default:
        return <FiClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'completed':
        return 'bg-profit-green/20 text-profit-green border-profit-green/30';
      case 'cancelled':
        return 'bg-loss-red/20 text-loss-red border-loss-red/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">Loading Orders...</p>
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
        <h1 className="text-4xl font-space font-bold gradient-text mb-2">
          Order History
        </h1>
        <p className="text-gray-400">View and manage your trading orders</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            icon: FiList,
            color: 'neon-cyan',
          },
          {
            label: 'Pending',
            value: orders.filter((o) => o.status === 'pending').length,
            icon: FiClock,
            color: 'yellow-500',
          },
          {
            label: 'Completed',
            value: orders.filter((o) => o.status === 'completed').length,
            icon: FiCheckCircle,
            color: 'profit-green',
          },
          {
            label: 'Cancelled',
            value: orders.filter((o) => o.status === 'cancelled').length,
            icon: FiXCircle,
            color: 'loss-red',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="glass-dark rounded-2xl p-6 relative overflow-hidden"
          >
            <div
              className={`absolute -top-10 -right-10 w-24 h-24 bg-${stat.color}/20 rounded-full blur-2xl`}
            ></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <stat.icon className={`text-${stat.color} text-xl`} />
              </div>
              <h2 className={`text-3xl font-bold text-${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center space-x-3">
          <FiFilter className="text-neon-cyan text-xl" />
          <span className="text-gray-400">Filter:</span>
          <div className="flex space-x-2">
            {['all', 'pending', 'completed', 'cancelled'].map((filterType) => (
              <motion.button
                key={filterType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  filter === filterType
                    ? 'bg-neon-cyan text-cyber-dark shadow-neon-cyan'
                    : 'text-gray-400 hover:glass'
                }`}
              >
                {filterType}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredOrders.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center">
              <FiList className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all'
                ? 'Start trading to see your orders here'
                : `No ${filter} orders found`}
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
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const commodity = commodities[order.commodity_id];
              const totalValue = order.price * order.quantity;

              return (
                <motion.div
                  key={order.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="glass-dark rounded-2xl p-6 card-hover"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    {/* Left Section */}
                    <div className="flex items-start space-x-4">
                      {/* Order Type Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          order.order_type === 'buy'
                            ? 'bg-profit-green/20'
                            : 'bg-loss-red/20'
                        }`}
                      >
                        {order.order_type === 'buy' ? (
                          <FiTrendingUp
                            className={`text-2xl ${
                              order.order_type === 'buy'
                                ? 'text-profit-green'
                                : 'text-loss-red'
                            }`}
                          />
                        ) : (
                          <FiTrendingDown className="text-2xl text-loss-red" />
                        )}
                      </div>

                      {/* Order Info */}
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold">
                            {commodity?.name || order.commodity_name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                              order.order_type === 'buy'
                                ? 'bg-profit-green/20 text-profit-green'
                                : 'bg-loss-red/20 text-loss-red'
                            }`}
                          >
                            {order.order_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {commodity?.symbol || order.commodity_symbol}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Quantity: </span>
                            <span className="font-mono font-bold">
                              {order.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Price: </span>
                            <span className="font-mono font-bold">
                              ${order.price.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Total: </span>
                            <span className="font-mono font-bold text-neon-green">
                              ${totalValue.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Date: </span>
                            <span className="font-mono">
                              {new Date(order.created_at).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                      {/* Status Badge */}
                      <div
                        className={`px-4 py-2 rounded-xl border flex items-center space-x-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="font-medium capitalize">
                          {order.status}
                        </span>
                      </div>

                      {/* Cancel Button */}
                      {order.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelOrder(order.id)}
                          className="p-3 rounded-xl glass hover:bg-loss-red/20 hover:border-loss-red/30 text-loss-red transition-all"
                          title="Cancel Order"
                        >
                          <FiTrash2 className="text-xl" />
                        </motion.button>
                      )}
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

export default Orders;
