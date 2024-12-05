import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { useApiConfigStore } from '../store/apiConfig';

const authApi = axios.create({
  withCredentials: true,
  baseURL: useApiConfigStore.getState().apiUrl || '',
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
