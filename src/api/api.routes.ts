import axios from "axios";

const API_ENV =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOP_API
    : "";

const axiosInstance = axios.create({
  // withCredentials: true,
  baseURL: API_ENV,
});

export const login = async (userName: string, password: string) => {
  try {
    const res = await axiosInstance.post(`/api/Usuario/login`, {
      UserName: userName,
      Password: password,
    });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
