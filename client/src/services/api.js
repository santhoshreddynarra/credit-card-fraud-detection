import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const getHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/predictions/stats');
  return response.data;
};

export const getPredictions = async (limit = 20) => {
  const response = await api.get(`/api/predictions?limit=${limit}`);
  return response.data;
};

export const createPrediction = async (transactionData) => {
  const response = await api.post('/api/predictions', transactionData);
  return response.data;
};

export default api;
