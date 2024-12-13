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

export const registerBillInvoice = (data: {
  id_CuentaPaciente: string | null;
  id_VentaCaja: string | null;
  pedidoRelacionado: string;
}) => {
  return axios.post(`${apiInvoicePatientBill}/registra-factura`, data);
};

export const getAccountBillInformation = async (params: string) => {
  const res = await axios.get(`${apiInvoicePatientBill}/obtener-cuenta-paciente-facturacion?${params}`);
  return res.data;
};

export const getPharmacySellInvoicesPagination = async (params: string) => {
  const res = await axios.get(`${apiInvoicePatientBill}/paginacion-facturacion-farmacia?${params}`);
  return res.data;
};

export const getPharmacySellInvoiceInformation = async (id: string) => {
  const res = await axios.get(`${apiInvoicePatientBill}/obtener-venta-farmacia/${id}`);
  return res.data;
};