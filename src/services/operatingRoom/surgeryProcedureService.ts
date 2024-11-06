import axios from '../../libs/axios';
import { ISurgery } from '../../types/operatingRoom/suergeryProcedureTypes';
const apiSurgeryProcedure = '/api/Quirofano/Catalogo/Cirugia';

export const registerSurgeryProcedure = async (data: {
  nombre: string;
  descripcion: string;
  precio: number;
}) => {
  const res = await axios.post(`${apiSurgeryProcedure}/registrar-cirugia`, data);
  return res.data;
};

export const getSurgeryProceduresPagination = async (params: string) => {
  const res = await axios.get(`${apiSurgeryProcedure}/paginacion-cirugia?${params}`);
  return res.data;
};

export const modifySurgeryProcedure = async (data: {
  nombre: string;
  descripcion: string;
  precio: number;
  id: string;
}) => {
  const res = await axios.put(`${apiSurgeryProcedure}/actualizar-cirugia`, data);
  return res.data;
};

export const deleteSurgeryProcedure = async (surgeryProcedureId: string) => {
  const res = await axios.delete(`${apiSurgeryProcedure}/estatus-cirugia`, { data: { id: surgeryProcedureId } });
  return res.data;
};

export const getAllSurgeryProcedures = async (): Promise<ISurgery[]> => {
  const res = await axios.get(`${apiSurgeryProcedure}/obtener-cirugias`);
  return res.data;
};
