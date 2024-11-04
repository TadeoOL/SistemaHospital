import axios from '../../libs/axios';
const apiAnesthesiologist = '/api/Quirofano/Catalogo/Anestesiologo';

export const getAnesthesiologistPagination = async (params: string) => {
  const res = await axios.get(`${apiAnesthesiologist}/paginacion-anestesiologo?${params}`);
  return res.data;
};

export const createAnesthesiologist = async (data: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
}) => {
  const res = await axios.post(`${apiAnesthesiologist}/registrar-anestesiologo`, data);
  return res.data;
};

export const modifyAnesthesiologist = async (data: {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
}) => {
  const res = await axios.put(`${apiAnesthesiologist}/actualizar-anestesiologo`, data);
  return res.data;
};

export const disableAnesthesiologist = async (id: string) => {
  const res = await axios.put(`${apiAnesthesiologist}/estatus-anestesiologo`, { id: id });
  return res.data;
};

export const getAllAnesthesiologists = async () => {
  const res = await axios.get(`${apiAnesthesiologist}/obtener-anestesiologos`);
  return res.data;
};
