import axios from '@/libs/axios';
import { GetParams } from '@/api/interface/params.interface';

export const getCheckoutReport = async (params: GetParams): Promise<any> => {
  const res = await axios.get(`/api/Reporte/paginacion-reporte-corte-caja`, { params });
  console.log('res:', res);
  return res.data;
};
