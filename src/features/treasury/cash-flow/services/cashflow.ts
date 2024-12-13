import axios from '@/libs/axios';
import { PaginatedResponse } from '@/types/tableComponentTypes';

export const getRevolventes = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/paginacion-revolventes';
  const res = await axios.get(endpoint, { params });
  return res.data;
};
