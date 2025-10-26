import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;

// Helper functions
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const get = (url, config) => apiCall('GET', url, null, config);
export const post = (url, data, config) => apiCall('POST', url, data, config);
export const put = (url, data, config) => apiCall('PUT', url, data, config);
export const del = (url, config) => apiCall('DELETE', url, null, config);