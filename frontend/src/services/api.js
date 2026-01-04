import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Commodities API
export const commoditiesAPI = {
  getAll: () => api.get('/commodities'),
  getBySymbol: (symbol) => api.get(`/commodities/${symbol}`),
  create: (data) => api.post('/commodities', data),
  update: (symbol, data) => api.put(`/commodities/${symbol}`, data),
  delete: (symbol) => api.delete(`/commodities/${symbol}`)
};

// Trading API
export const tradingAPI = {
  buy: (orderData) => api.post('/trading/buy', orderData),
  sell: (orderData) => api.post('/trading/sell', orderData),
  getOrders: () => api.get('/trading/orders'),
  getPortfolio: () => api.get('/trading/portfolio')
};

// Watchlist API
export const watchlistAPI = {
  get: () => api.get('/watchlist'),
  add: (commoditySymbol) => api.post('/watchlist', { commodity_symbol: commoditySymbol }),
  remove: (commoditySymbol) => api.delete(`/watchlist/${commoditySymbol}`)
};

// Alerts API
export const alertsAPI = {
  get: () => api.get('/alerts'),
  create: (alertData) => api.post('/alerts', alertData),
  delete: (id) => api.delete(`/alerts/${id}`),
  check: () => api.post('/alerts/check')
};

// Transactions API
export const transactionsAPI = {
  get: (limit) => api.get(`/transactions?limit=${limit || 50}`),
  deposit: (amount) => api.post('/transactions/deposit', { amount }),
  withdraw: (amount) => api.post('/transactions/withdraw', { amount })
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getOrders: () => api.get('/admin/orders'),
  getTransactions: () => api.get('/admin/transactions'),
  getStats: () => api.get('/admin/stats')
};

export default api;
