import axios from '../../libs/axios';

const apiReport = '/api/Reporte';

export const getReport = async (data: string) => {
  const res = await axios.post(`${apiReport}/generar-reporte-tabla`, { tablaJSON: data });
  return res.data;
};
