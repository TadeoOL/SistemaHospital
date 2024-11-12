import axios from '../../libs/axios';

const apiUrl = '/api/PaseCaja';

export const getCashVoucherPagination = async (param: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-pase-caja?${param}`);
  return res.data;
};

export const getCashVoucherConfig = async () => {
  const res = await axios.get(`/api/Sistema/obtener-configuracion/PaseCaja`);
  return res.data;
};

export const registerCashVoucher = async (data: {
  paciente: string;
  totalVenta: number;
  moduloProveniente: string;
  notas?: string;
}) => {
  const res = await axios.post(`${apiUrl}/registrar-pase-caja`, data);
  return res.data;
};

export const changeCashVoucherStatus = async (data: {
  id_VentaCaja: string;
  estadoVenta: number;
}) => {
  const res = await axios.put(`${apiUrl}/estatus-pase-caja`, data);
  return res.data;
};

