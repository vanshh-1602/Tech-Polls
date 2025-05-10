import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export the api instance
export default api;

// Export common API endpoints
export const endpoints = {
  // Auth endpoints
  register: '/auth/register',
  login: '/auth/login',
  currentUser: '/auth/me',
  
  // Polls endpoints
  polls: '/polls',
  poll: (id) => `/polls/${id}`,
  vote: (id) => `/polls/${id}/vote`,
  
  // Comments endpoints
  pollComments: (pollId) => `/comments/${pollId}`,
  comments: '/comments'
};
