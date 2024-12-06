//import axiosContpaqi from '../../libs/axiosContpaqi';
import axios from '../../libs/axios';
const apiInvoicePatientBill = '/api/Facturacion';

export const getInvoicePatientBillPagination = async (params: string) => {
  const res = await axios.get(`${apiInvoicePatientBill}/paginacion-facturacion-pacientes?${params}`);
  return res.data;
};

export const generatePatientBillInvoice = (data: {
  id_CuentaPaciente: string;
  tipoFacturacion: number;
  tipoPedido: number;
  porcentajeDescuento: number;
}) => {
  return axios.post(`${apiInvoicePatientBill}/crear-facturacion-cuenta-paciente`, data);
};

export const getAccountBillInformation = async (data: {
  id_CuentaPaciente: string;
  opcionFacturacion: {
    articulos: boolean;
    servicios: boolean;
    cuartos: boolean;
    quirofanos: boolean;
    equipoHonorario: boolean;
    cirugias: boolean;
  }
}) => {
  const res = await axios.post(`${apiInvoicePatientBill}/obtener-cuenta-paciente-facturacion`, data);
  return res.data;
};
