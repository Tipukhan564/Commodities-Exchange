import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaChartLine, FaWallet, FaFire } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const Dashboard = () => {
  const [accountType, setAccountType] = useState('live');
  const [portfolioValue, setPortfolioValue] = useState(124592.30);
  const [dayChange, setDayChange] = useState(1204.50);
  const [dayChangePercent, setDayChangePercent] = useState(1.4);

  // Mock market data
  const marketPairs = [
    {
      symbol: 'GC=F',
      name: 'Gold',
      bid: 2050.50,
      ask: 2051.20,
      change: 0.27,
      icon: '🥇',
      spread: 'Tight'
    },
    {
      symbol: 'SI=F',
      name: 'Silver',
      bid: 25.75,
      ask: 25.78,
      change: 0.59,
      icon: '🥈',
      spread: 'Medium'
    },
    {
      symbol: 'CL=F',
      name: 'Crude Oil',
      bid: 78.25,
      ask: 78.30,
      change: 0.58,
      icon: '🛢️',
      spread: 'Tight'
    },
    {
      symbol: 'NG=F',
      name: 'Natural Gas',
      bid: 2.85,
      ask: 2.87,
      change: -1.72,
      icon: '⚡',
      spread: 'Wide'
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>

      {/* Safe Area Top */}
      <div className="safe-area-top"></div>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-cyan flex items-center justify-center font-bold text-lg shadow-neon-cyan ring-2 ring-neon-cyan/30">
            JD
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0">
            <div className="live-dot-ring"></div>
            <div className="live-dot"></div>
          </div>
        </div>

        {/* Notification Bell */}
        <motion.button
          className="relative w-12 h-12 rounded-full glass flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBell className="text-neon-cyan text-xl" />
          {/* Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-red rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
            3
          </span>
        </motion.button>
      </motion.header>

      {/* Account Type Selector */}
      <motion.div
        className="px-6 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex h-12 w-full items-center rounded-xl glass p-1 relative">
          {/* Sliding Background */}
          <motion.div
            className="absolute h-10 rounded-lg bg-gradient-cyan shadow-neon-cyan"
            animate={{
              left: accountType === 'demo' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          ></motion.div>

          <button
            onClick={() => setAccountType('demo')}
            className={`relative z-10 h-full flex-1 rounded-lg text-sm font-bold transition-colors ${
              accountType === 'demo' ? 'text-cyber-dark' : 'text-gray-400'
            }`}
          >
            Demo Account
          </button>
          <button
            onClick={() => setAccountType('live')}
            className={`relative z-10 h-full flex-1 rounded-lg text-sm font-bold transition-colors ${
              accountType === 'live' ? 'text-cyber-dark' : 'text-gray-400'
            }`}
          >
            Live Account
          </button>
        </div>
      </motion.div>

      {/* Portfolio Card */}
      <motion.div
        className="px-6 mt-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="glass-dark rounded-3xl p-6 relative overflow-hidden transform-3d">
          {/* Glow Overlay */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-neon-green/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                Total Equity
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green text-xs font-bold">LIVE</span>
              </div>
            </div>

            {/* Portfolio Value */}
            <div className="mb-3">
              <h1 className="text-5xl font-space font-bold neon-text mb-2">
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>

              {/* Change Badge */}
              <div className="inline-flex items-center gap-2 bg-profit-green/10 border border-profit-green/30 px-3 py-1.5 rounded-full">
                <MdTrendingUp className="text-profit-green" />
                <span className="text-profit-green font-bold text-sm">
                  +${dayChange.toFixed(2)} ({dayChangePercent}%)
                </span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="mt-4 h-20 flex items-end gap-1">
              {[65, 72, 68, 75, 73, 78, 82, 79, 85, 88, 92, 90, 95, 98, 100].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-neon-green/40 to-neon-green rounded-t transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-gray-400 text-xs mb-1">Balance</p>
                <p className="text-white font-bold">$89,234</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Margin</p>
                <p className="text-white font-bold">$35,358</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Free</p>
                <p className="text-neon-green font-bold">$53,876</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Markets Section */}
      <motion.div
        className="px-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-space font-bold flex items-center gap-2">
            <FaFire className="text-neon-red" />
            Live Markets
          </h2>
          <button className="text-neon-cyan text-sm font-semibold">
            View All →
          </button>
        </div>

        {/* Market Pairs List */}
        <div className="space-y-3">
          {marketPairs.map((pair, index) => (
            <motion.div
              key={pair.symbol}
              className="glass rounded-2xl p-4 card-hover relative overflow-hidden"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {/* Glow Effect */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                pair.change > 0 ? 'bg-profit-green' : 'bg-loss-red'
              }`}></div>

              <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                    {pair.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{pair.name}</h3>
                    <p className="text-xs text-gray-400">{pair.symbol}</p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span className="text-sm text-gray-400">Bid</span>
                    <span className="font-mono font-bold text-white">
                      {pair.bid.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${
                    pair.change > 0 ? 'text-profit-green' : 'text-loss-red'
                  }`}>
                    {pair.change > 0 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    {Math.abs(pair.change)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <motion.button
                  className="py-2 rounded-lg bg-profit-green/10 border border-profit-green/30 text-profit-green font-bold text-sm hover:bg-profit-green/20 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  BUY
                </motion.button>
                <motion.button
                  className="py-2 rounded-lg bg-loss-red/10 border border-loss-red/30 text-loss-red font-bold text-sm hover:bg-loss-red/20 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  SELL
                </motion.button>
              </div>

              {/* Spread Indicator */}
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pair.spread === 'Tight'
                    ? 'bg-profit-green/20 text-profit-green'
                    : pair.spread === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-loss-red/20 text-loss-red'
                }`}>
                  {pair.spread}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-cyan shadow-neon-cyan flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(13, 204, 242, 0.5)',
            '0 0 30px rgba(13, 204, 242, 0.8)',
            '0 0 20px rgba(13, 204, 242, 0.5)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FaChartLine className="text-cyber-dark text-xl" />
      </motion.button>

      {/* Safe Area Bottom */}
      <div className="safe-area-bottom"></div>
      <div className="h-20"></div> {/* Spacing for bottom nav */}
    </div>
  );
};

export default Dashboard;
