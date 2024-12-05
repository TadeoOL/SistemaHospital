import axios from '@/libs/axios';
const baseUrl = '/api/Facturacion/Catalogo/Producto';

export const addProductToInvoice = async (data: {
  id?: string;
  codigoSAT: string;
  codigoUnidadMedida: string;
  tipoProducto: number;
  codigoProducto: string;
  id_Relacion: string; //Id del Producto ligado a la factura
}) => {
  const res = await axios.put(`${baseUrl}/actualizar-producto`, data);
  return res.data;
};
