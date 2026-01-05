import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isLogin
        ? await login({ username: formData.username, password: formData.password })
        : await register(formData);

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-green/20 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-cyan/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-green/30 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-green shadow-neon-cyan"
              />
              <h1 className="text-3xl font-space font-bold gradient-text mb-2">
                CommodityX
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex glass rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  isLogin
                    ? 'bg-neon-cyan text-cyber-dark shadow-neon-cyan'
                    : 'text-gray-400'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? 'bg-neon-green text-cyber-dark shadow-neon-green'
                    : 'text-gray-400'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-neon-red/10 border border-neon-red/30 text-neon-red text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-neon-cyan focus:shadow-neon-cyan transition-all outline-none"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Email (Register only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-neon-cyan focus:shadow-neon-cyan transition-all outline-none"
                      placeholder="Enter email"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Full Name (Register only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-neon-cyan focus:shadow-neon-cyan transition-all outline-none"
                      placeholder="Enter full name"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 rounded-xl glass border border-white/10 focus:border-neon-cyan focus:shadow-neon-cyan transition-all outline-none"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-green text-cyber-dark font-bold shadow-neon-cyan hover:shadow-neon-green transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : isLogin ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-400 text-sm mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-neon-cyan hover:text-neon-green transition-colors font-medium"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
