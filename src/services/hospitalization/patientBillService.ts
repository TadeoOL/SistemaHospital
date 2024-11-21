import axios from '../../libs/axios';
const apiPatientBill = '/api/CuentaPaciente';

export const updateOperatingRoomType = async (data: {
  id_RegistroCuarto: string;
  id_TipoCuarto: string;
  id_CuentaPaciente: string;
}) => {
  const res = await axios.put(`${apiPatientBill}/modificar-registro-quirofano-cierre`, data);
  return res.data;
};
