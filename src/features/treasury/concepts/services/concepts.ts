import axios from '@/libs/axios';
import { IConcept } from '../../types/types.common';

const baseUrl = '/api/Tesoreria/Configuracion';

export const getAllConceptosSalida = async (): Promise<IConcept[]> => {
  const endpoint = `${baseUrl}/obtener-conceptos-salida`;
  const res = await axios.get(endpoint);
  return res.data;
};

export const disableConceptSalida = async (id: string) => {
  const endpoint = `${baseUrl}/estatus-concepto-salida`;
  const res = await axios.put(endpoint, { id });
  return res.data;
};

export const getConcepts = async (params: any) => {
  const endpoint = `${baseUrl}/paginacion-concepto-salida`;
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getConceptById = async (id: string) => {
  const endpoint = `${baseUrl}/${id}`;
  const res = await axios.get(endpoint);
  return res.data;
};

export const createConcept = async (data: any) => {
  const endpoint = `${baseUrl}/registrar-concepto-salida`;
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const updateConcept = async (data: any) => {
  const endpoint = `${baseUrl}/actualizar-concepto-salida`;
  const res = await axios.put(endpoint, data);
  return res.data;
};
