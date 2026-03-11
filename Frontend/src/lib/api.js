import axios from 'axios';

// baseURL points to the Node/Express server; adjust if running on a different port or using a proxy
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
