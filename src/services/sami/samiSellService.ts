import axios from '../../libs/axios';
const apiSamiSell = '/api/VentaSami';

export const createSamiSell = async (data: { id_CuentaPaciente: string; venta_Total: string; nota?: string }) => {
  const res = await axios.post(`${apiSamiSell}/crear-venta-sami`, data);
  return res.data;
};
