import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiPieChart,
  FiTrendingUp,
  FiShoppingCart,
  FiList,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/portfolio', icon: FiPieChart, label: 'Portfolio' },
    { path: '/charts', icon: FiTrendingUp, label: 'Charts' },
    { path: '/trade', icon: FiShoppingCart, label: 'Trade' },
    { path: '/orders', icon: FiList, label: 'Orders' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green animate-pulse-glow"></div>
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green blur-lg opacity-50"></div>
              </div>
              <span className="text-xl font-space font-bold gradient-text">
                CommodityX
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                      isActive(item.path)
                        ? 'glass text-neon-cyan shadow-neon-cyan'
                        : 'text-gray-400 hover:text-white hover:glass'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome</p>
                <p className="font-medium text-neon-cyan">{user?.username}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 rounded-xl glass hover:shadow-neon-red text-neon-red transition-all"
              >
                <FiLogOut className="text-xl" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-green"></div>
            <span className="text-lg font-space font-bold gradient-text">CommodityX</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg glass"
          >
            {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 glass-dark border-b border-white/10 p-4 space-y-2"
          >
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`px-4 py-3 rounded-xl flex items-center space-x-3 ${
                    isActive(item.path)
                      ? 'glass text-neon-cyan shadow-neon-cyan'
                      : 'text-gray-400 hover:glass'
                  }`}
                >
                  <item.icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl flex items-center space-x-3 text-neon-red hover:glass"
            >
              <FiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
