import axios from '../../libs/axios';
const apiMedic = '/api/Medico';

export const getAllMedics = async () => {
  const res = await axios.get(`${apiMedic}/obtener-medicos`);
  return res.data;
};

export const getMedicPagination = async (params: string) => {
  const res = await axios.get(`${apiMedic}/paginacion-medico?${params}`);
  return res.data;
};

export const createMedic = async (data: {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}) => {
  const res = await axios.post(`${apiMedic}/registrar-medico`, data);
  return res.data;
};

export const modifyMedic = async (data: {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}) => {
  const res = await axios.put(`${apiMedic}/modificar-medico`, data);
  return res.data;
};

export const disableMedic = async (id: string) => {
  const res = await axios.put(`${apiMedic}/deshabilitar-medico`, { id: id });
  return res.data;
};
