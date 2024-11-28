import axios from '@/libs/axios';
import { GetParams } from '@/api/interface/params.interface';

export const getCheckoutReport = async (params?: GetParams): Promise<any> => {
  const res = await axios.get(`/api/Reporte/paginacion-reporte-corte-caja`, { params });
  return res.data;
};

export const getCheckoutReportSummary = async (id: string): Promise<any> => {
  const res = await axios.get(`/api/Caja/resumen-caja/${id}`);
  return res.data;
};
