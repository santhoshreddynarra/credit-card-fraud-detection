import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor to attach Authorization Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle global 401 Unauthorized responses
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Clear expired/invalid token if non-auth endpoint returns 401
    const url = error.config?.url || '';
    if (!url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return Promise.reject(error);
});

// Public Endpoints
export const getHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

// Auth API Endpoints
export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};

// Protected Prediction API Endpoints (user-isolated)
export const getStats = async () => {
  const response = await api.get('/api/predictions/stats');
  return response.data;
};

export const getPredictions = async (limit = 20, page = 1) => {
  const response = await api.get(`/api/predictions?limit=${limit}&page=${page}`);
  return response.data;
};

export const createPrediction = async (transactionData) => {
  const response = await api.post('/api/predictions', transactionData);
  return response.data;
};

export default api;
