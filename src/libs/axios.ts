import axios from 'axios';
import { useAuthStore } from '../store/auth';

export const API_ENV =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_DEVELOP_API
      : '';

const authApi = axios.create({
  withCredentials: true,
  baseURL: API_ENV,
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  (r) => r,
  (error) => {
    const isError = [400, 401, 403, 404, 500].includes(error.response.status);
    if (isError) {
      console.error('Error', {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
);

export default authApi;
