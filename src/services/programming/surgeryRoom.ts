import axios from "../../libs/axios";

const apiUrl = '/api/Programacion/Catalogo/Quirofano';

export const getAllSurgeryRooms = async () => {
  const res = await axios.get(`${apiUrl}/obtener-quirofanos`);
  return res.data;
};

export const registerSurgeryRoom = async (data: {
  nombre: string;
  id_TipoQuirofano: string;
  descripcion: string;
}) => {
  const res = await axios.post(`${apiUrl}/registrar-quirofano`, data);
  return res.data;
};

export const modifySurgeryRoom = async (data: {
  nombre: string;
  id_TipoQuirofano: string;
  descripcion: string;
  id: string;
}) => {
  const res = await axios.put(`${apiUrl}/actualizar-quirofano`, data);
  return res.data;
};

