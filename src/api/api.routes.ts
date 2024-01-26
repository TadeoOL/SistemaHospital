import axios from "../libs/axios";
import { IAddUser, IUpdateUsers } from "../types/types";

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

export const updateUserData = async (user: IUpdateUsers) => {
  const {
    apellidoMaterno,
    apellidoPaterno,
    email,
    id,
    nombre,
    nombreUsuario,
    roles,
    telefono,
  } = user;
  const res = await axios.put(`/api/Usuario/UpdateAdminUser`, {
    id: id,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    email,
    nombreUsuario,
    roles,
  });
  return res.data;
};

export const getUsers = async (paramUrl: string) => {
  try {
    const res = await axios.get(`/api/Usuario/paginationUser?${paramUrl}`);
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const disableUser = async (userId: string) => {
  const res = await axios.put(`/api/Usuario/UpdateAdminStatusUser`, {
    id: userId,
  });
  return res.data;
};

export const updateBasicUserInformation = async (
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  telefono: string,
  email: string
) => {
  try {
    const res = await axios.put(`/api/Usuario/UpdateUser`, {
      Nombre: nombre,
      ApellidoPaterno: apellidoPaterno,
      ApellidoMaterno: apellidoMaterno,
      Telefono: telefono,
      Email: email,
    });
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const registerNewUser = async (user: IAddUser) => {
  const {
    apellidoMaterno,
    apellidoPaterno,
    email,
    imagenURL,
    nombre,
    contrasena,
    roles,
    telefono,
    nombreUsuario,
  } = user;
  const res = await axios.post(`/api/Usuario/register`, {
    apellidoMaterno,
    apellidoPaterno,
    email,
    imagenURL,
    nombre,
    contrasena,
    roles,
    telefono,
    nombreUsuario,
  });
  return res.data;
};
