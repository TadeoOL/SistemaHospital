import axios from '../../libs/axios';

export const obtenerReporteCaja = async (id_CajaPrincipal: string) => {
  const res = await axios.get(`/api/Reporte/CorteCaja/reporte-caja/${id_CajaPrincipal}`);
  return res.data;
};
