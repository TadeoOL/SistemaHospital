import axios from 'axios';
import { useAuthStore } from '../store/auth';

export const API_CONTPAQI_ENV =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_DEVELOP_CONTPAQI_API
    : import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_DEVELOP_CONTPAQI_API
      : '';

const authApi = axios.create({
  withCredentials: true,
  baseURL: API_CONTPAQI_ENV,
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
