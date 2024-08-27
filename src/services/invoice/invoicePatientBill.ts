import axios from '../../libs/axios';
const apiInvoicePatientBill = '/api/FacturacionCuentaPaciente';

export const getInvoicePatientBillPagination = async (params: string) => {
  const res = await axios.get(`${apiInvoicePatientBill}/paginacion-facturacion-cuentas-paciente?${params}`);
  return res.data;
};

export const generatePatientBillInvoice = (data: {
  id_CuentaPaciente: string;
  tipoFacturacion: number;
  tipoPedido: number;
}) => {
  return axios.post(`${apiInvoicePatientBill}/crear-facturacion-cuenta-paciente`, data);
};
