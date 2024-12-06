import axios from '@/libs/axios';
import { ProductType } from '@/types/contpaqiTypes';
import { AddInvoiceProductCommand } from '@/types/invoice/invoice.product.types';
const baseUrl = '/api/Facturacion/Catalogo/Producto';

export namespace InvoiceProductService {
  export const addProductToInvoice = async (data: {
    id?: string;
    codigoSAT: string;
    codigoUnidadMedida: string;
    tipoProducto: ProductType;
    codigoProducto: string;
    id_Relacion: string; //Id del Producto ligado a la factura
    //Quirofano
    codigoSATRecuperacion?: string;
    codigoUnidadMedidaRecuperacion?: string;
  }): Promise<AddInvoiceProductCommand> => {
    const res = await axios.put(`${baseUrl}/actualizar-producto`, data);
    return res.data;
  };
}
