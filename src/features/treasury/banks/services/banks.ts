import axios from '@/libs/axios';
import { PaginatedResponse } from '@/types/tableComponentTypes';

export const getPaginacionBanco = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Banco/paginacion-banco';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getSaldoBanco = async (params?: any): Promise<any> => {
  const endpoint = '/api/Tesoreria/Banco/obtener-saldo-banco';
  const res = await axios.get(endpoint, { params });
  return res.data;
};
