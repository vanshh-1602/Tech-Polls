import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


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


export default api;


export const endpoints = {

  register: '/auth/register',
  login: '/auth/login',
  currentUser: '/auth/me',
  

  polls: '/polls',
  poll: (id) => `/polls/${id}`,
  vote: (id) => `/polls/${id}/vote`,
  

  pollComments: (pollId) => `/comments/${pollId}`,
  comments: '/comments'
};
