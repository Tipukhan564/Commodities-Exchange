import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { commoditiesAPI } from '../services/api';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiClock,
  FiSearch,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Charts = () => {
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const timeframes = ['1H', '1D', '1W', '1M', '3M', '1Y'];

  useEffect(() => {
    fetchCommodities();
  }, []);

  useEffect(() => {
    if (selectedCommodity) {
      fetchPriceHistory(selectedCommodity.id);
    }
  }, [selectedCommodity]);

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

  const fetchPriceHistory = async (commodityId) => {
    try {
      const response = await commoditiesAPI.getPriceHistory(commodityId);
      setPriceHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      // Generate mock data if API fails
      generateMockPriceHistory();
    }
  };

  const generateMockPriceHistory = () => {
    const mockData = [];
    const basePrice = selectedCommodity?.current_price || 1000;
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const randomChange = (Math.random() - 0.5) * basePrice * 0.05;
      mockData.push({
        timestamp: date.toISOString(),
        price: basePrice + randomChange,
      });
    }
    setPriceHistory(mockData);
  };

  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = priceHistory.map((item) => ({
    time: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: parseFloat(item.price),
  }));

  const priceChange =
    chartData.length > 1
      ? chartData[chartData.length - 1].price - chartData[0].price
      : 0;
  const priceChangePercent =
    chartData.length > 0 ? (priceChange / chartData[0].price) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">Loading Charts...</p>
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
          Market Charts
        </h1>
        <p className="text-gray-400">Advanced price analysis and trends</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Commodities List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-dark rounded-2xl p-4 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Commodities</h2>

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

        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {selectedCommodity && (
            <>
              {/* Commodity Info */}
              <div className="glass-dark rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedCommodity.name}</h2>
                    <p className="text-gray-400">{selectedCommodity.symbol}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl ${
                      priceChange >= 0
                        ? 'bg-profit-green/20 text-profit-green'
                        : 'bg-loss-red/20 text-loss-red'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {priceChange >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                      <span className="font-bold">
                        {priceChange >= 0 ? '+' : ''}
                        {priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3">
                  <h1 className="text-5xl font-bold neon-text-cyan font-mono">
                    ${selectedCommodity.current_price.toFixed(2)}
                  </h1>
                  <span
                    className={`text-xl font-medium ${
                      priceChange >= 0 ? 'text-profit-green' : 'text-loss-red'
                    }`}
                  >
                    {priceChange >= 0 ? '+' : ''}$
                    {Math.abs(priceChange).toFixed(2)}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
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

              {/* Timeframe Selector */}
              <div className="glass-dark rounded-2xl p-4 mb-6">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {timeframes.map((tf) => (
                    <motion.button
                      key={tf}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTimeframe(tf)}
                      className={`px-6 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                        timeframe === tf
                          ? 'bg-neon-cyan text-cyber-dark shadow-neon-cyan'
                          : 'text-gray-400 hover:glass'
                      }`}
                    >
                      {tf}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiActivity className="text-neon-cyan text-xl" />
                  <h3 className="text-xl font-bold">Price Chart</h3>
                </div>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#0dccf2"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0dccf2"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="time"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15, 22, 19, 0.9)',
                          border: '1px solid rgba(13, 204, 242, 0.3)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#0dccf2"
                        strokeWidth={2}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-gray-400">No chart data available</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;
