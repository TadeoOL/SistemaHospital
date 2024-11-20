const apiUrl = '/api/CuentaPaciente';
import axios from '../../libs/axios';
import { ICashierSale } from '../../types/checkout/cashierSaleTypes';
import { DiscountType, IDiscount } from '../../types/checkout/discountTypes';
import { IPatientAccount, IPatientAccountPagination } from '../../types/checkout/patientAccountTypes';
import { IPagination } from '../../types/paginationType';

export const getPatientAccount = async (id: string): Promise<IPatientAccount> => {
  const res = await axios.get(`${apiUrl}/obtener-cuenta-paciente/${id}`);
  return res.data;
};

export const getPatientAccountPagination = async (param: string): Promise<IPagination<IPatientAccountPagination>> => {
  const res = await axios.get(`${apiUrl}/paginacion-cuenta-paciente?${param}`);
  return res.data;
};

export const changeStatusPatientAccount = async (data: {
  id: string;
  estatus: number;
}) => {
  const res = await axios.put(`${apiUrl}/estatus-cuenta-paciente`, data);
  return res.data;
};

export const applyDiscountPatientBill = async (data: {
  id: string;
  montoDescuento: number;
  motivoDescuento?: string;
  tipoDescuento: DiscountType;
}) => {
  const res = await axios.post(`${apiUrl}/aplicar-descuento-cuenta-paciente`, data);
  return res.data;
};

export const getPatientBillById = async (id_CuentaPaciente: string): Promise<IDiscount> => {
  const res = await axios.get(`${apiUrl}/descuento-por-cuenta-paciente`, {
    params: {
      id_CuentaPaciente,
    },
  });
  return res.data;
};

export const createPatientAccountDeposit = async (data: {
  id_CuentaPaciente: string;
  cantidad: number;
  tipoDeposito: number;
}): Promise<ICashierSale> => {
  const res = await axios.post(`${apiUrl}/registrar-deposito-cuenta-paciente`, data);
  return res.data;
};
