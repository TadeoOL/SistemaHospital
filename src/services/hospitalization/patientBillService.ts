import axios from '../../libs/axios';
import { DiscountType, IDiscount } from '../../types/hospitalizationTypes';
const apiPatientBill = '/api/CuentaPaciente';

export const updateOperatingRoomType = async (data: {
  id_RegistroCuarto: string;
  id_TipoCuarto: string;
  id_CuentaPaciente: string;
}) => {
  const res = await axios.put(`${apiPatientBill}/modificar-registro-quirofano-cierre`, data);
  return res.data;
};

export const createDiscountPatientBill = async (data: {
  id_CuentaPaciente: string;
  montoDescuento: number;
  motivoDescuento?: string;
  tipoDescuento: DiscountType;
}) => {
  const res = await axios.post(`${apiPatientBill}/crear-descuento-cuenta-paciente`, data);
  return res.data;
};

export const getPatientBillById = async (id_CuentaPaciente: string) => {
  const res = await axios.get(`${apiPatientBill}/descuento-por-cuenta-paciente`, {
    params: {
      id_CuentaPaciente,
    },
  });
  return res.data as IDiscount;
};
