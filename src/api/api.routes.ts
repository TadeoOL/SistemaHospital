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
    confirmarContrasena,
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
    confirmarContrasena,
  });
  return res.data;
};

export const changeUserPassword = async (
  password: string,
  confirmPassword: string
) => {
  const res = await axios.put(`/api/Usuario/changePassword`, {
    contrasena: password,
    confirmarContrasena: confirmPassword,
  });
  return res.data;
};

export const AdminChangeUsersPassword = async (
  id: string,
  password: string,
  confirmPassword: string
) => {
  const res = await axios.put(`/api/Usuario/ChangeAdminPassword`, {
    id: id,
    contrasena: password,
    confirmarContrasena: confirmPassword,
  });
  return res.data;
};
