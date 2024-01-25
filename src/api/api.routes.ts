import axios from "../libs/axios";

export const login = async (userName: string, password: string) => {
  try {
    const res = await axios.post(`/api/Usuario/login`, {
      UserName: userName,
      Password: password,
    });
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const updateUserData = async (userName: string, password: string) => {
  try {
    const res = await axios.post(`/api/Usuario/login`, {
      UserName: userName,
      Password: password,
    });
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const getUsers = async (paramUrl: string) => {
  console.log("Entraa");
  try {
    const res = await axios.get(`/api/Usuario/paginationUser?${paramUrl}`);
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};
