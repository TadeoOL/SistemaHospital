import axios from '@/libs/axios';

const apiUrl = '/api/Programacion/Catalogo/Quirofano';

export const getAllOperatingRooms = async () => {
  const res = await axios.get(`${apiUrl}/obtener-quirofanos`);
  return res.data;
};

export const getOperatingRooms = async (params: any) => {
  const res = await axios.get(`${apiUrl}/paginacion-quirofano`, { params });
  return res.data;
};

export const registerOperatingRoom = async (data: {
  nombre: string;
  id_TipoQuirofano: string;
  descripcion: string;
}) => {
  const res = await axios.post(`${apiUrl}/registrar-quirofano`, data);
  return res.data;
};

export const modifyOperatingRoom = async (data: {
  nombre: string;
  id_TipoQuirofano: string;
  descripcion: string;
  id: string;
}) => {
  const res = await axios.put(`${apiUrl}/actualizar-quirofano`, data);
  return res.data;
};

export const disableOperatingRoom = async (id: string) => {
  const res = await axios.put(`${apiUrl}/estatus-quirofano`, { id });
  return res.data;
};
