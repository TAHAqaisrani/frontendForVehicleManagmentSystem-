import axios from 'axios';

const isProd = import.meta.env.PROD;
const api = axios.create({ 
  baseURL: isProd 
    ? 'https://backendforvehicle-managment-system.onrender.com/api' 
    : '/api' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vsc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vsc_token');
      localStorage.removeItem('vsc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
