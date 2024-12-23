import axios from '../../libs/axios';

const apiUrl = '/api/Caja';

export const getCashVoucherPagination = async (param: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-ventas?${param}`);
  return res.data;
};

export const getCashVoucherConfig = async () => {
  const res = await axios.get(`/api/Sistema/obtener-configuracion/PaseCaja`);
  return res.data;
};

export const changeCashVoucherStatus = async (data: {
  id_VentaCaja: string;
  estatus: number;
  //id_CajaUsuario: string;
}) => {
  const res = await axios.put(`${apiUrl}/estatus-venta`, data);
  return res.data;
};
