import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token to headers
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTHENTICATION ENDPOINTS
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// USER ENDPOINTS
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
};

// TASK ENDPOINTS
export const taskAPI = {
  getTasks: () => api.get('/task'),
  createTask: (taskData) => api.post('/task', taskData),
  updateTask: (taskId, taskData) => api.put(`/task/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/task/${taskId}`),
};

export default api;