import axios from "axios";

const API_ENV =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOP_API
    : "";

const authApi = axios.create({
  withCredentials: true,
  baseURL: API_ENV,
});

authApi.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("auth");
  console.log({ authToken });
  const auth = JSON.parse(authToken ? authToken : "");
  const token = auth.state.token;
  console.log({ token });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
