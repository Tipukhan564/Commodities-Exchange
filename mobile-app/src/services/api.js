import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Commodities APIs
export const commoditiesAPI = {
  getAll: () => api.get('/commodities'),
  getById: (id) => api.get(`/commodities/${id}`),
  getPriceHistory: (id) => api.get(`/commodities/${id}/history`),
};

// Trading APIs
export const tradingAPI = {
  placeOrder: (orderData) => api.post('/trading/order', orderData),
  getOrders: () => api.get('/trading/orders'),
  cancelOrder: (orderId) => api.delete(`/trading/orders/${orderId}`),
  getPortfolio: () => api.get('/trading/portfolio'),
};

// Watchlist APIs
export const watchlistAPI = {
  get: () => api.get('/watchlist'),
  add: (commodityId) => api.post('/watchlist', { commodity_id: commodityId }),
  remove: (commodityId) => api.delete(`/watchlist/${commodityId}`),
};

// Alerts APIs
export const alertsAPI = {
  get: () => api.get('/alerts'),
  create: (alertData) => api.post('/alerts', alertData),
  delete: (alertId) => api.delete(`/alerts/${alertId}`),
};

// Transactions APIs
export const transactionsAPI = {
  get: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
};

export default api;
