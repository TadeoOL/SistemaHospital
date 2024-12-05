const baseUrl = '/api/productos';
import axios from '@/libs/axiosContpaqi';

export const addProductToInvoiceService = async (data: {
  nombre: string;
  codigoContpaq: string;
  precioVenta: string;
  iva: boolean;
  codigoSAT: string;
  id_UnidadMedida: string;
}) => {
  const res = await axios.post(`${baseUrl}/agregar-producto`, data);
  return res.data;
};

export const modifyProductToInvoiceService = async (data: {
  nombre: string;
  codigoContpaq: string;
  precioVenta: string;
  iva: boolean;
  codigoSAT: string;
  id_UnidadMedida: string;
}) => {
  const res = await axios.put(`${baseUrl}/modificar-producto`, data);
  return res.data;
};