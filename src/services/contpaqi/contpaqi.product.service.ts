const baseUrl = '/api/productos';
import axios from '@/libs/axiosContpaqi';

export namespace ContpaqiProductService {
  export const addProductToInvoiceService = async (data: {
    nombre: string;
    codigoContpaq: string;
    precioVenta: number;
    iva: boolean;
    codigoSAT: string;
    id_UnidadMedida: number;
  }) => {
    const res = await axios.post(`${baseUrl}/agregar-producto`, data);
    return res.data;
  };

  export const modifyProductToInvoiceService = async (data: {
    nombre: string;
    codigoContpaq: string;
    precioVenta: number;
    iva: boolean;
    codigoSAT: string;
    id_UnidadMedida: number;
  }) => {
    const res = await axios.put(`${baseUrl}/modificar-producto`, data);
    return res.data;
  };
}
