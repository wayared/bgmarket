import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:44397/api', // Cambia esto si usas un puerto distinto
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
