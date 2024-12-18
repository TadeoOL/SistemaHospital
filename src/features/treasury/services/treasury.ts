import axios from '@/libs/axios';
import { IConcept } from '../types/types.common';
const baseUrl = '/api/Tesoreria/Configuracion';

export const createAuthorization = async (data: any) => {
  const endpoint = '/api/Tesoreria/Revolvente/asignar-revolvente-caja';
  const res = await axios.post(endpoint, data);
  return res;
};

export const getConcepts = async (): Promise<IConcept[]> => {
  const endpoint = `${baseUrl}/obtener-conceptos-salida`;
  const res = await axios.get(endpoint);
  return res.data;
};
