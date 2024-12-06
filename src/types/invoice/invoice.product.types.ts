import { ProductType } from '../contpaqiTypes';

export interface IInvoiceProduct {
  id: string;
  codigoProducto: string;
  codigoSAT: string;
  codigoUnidadMedida: string;
  tipoProducto: ProductType;
}

export interface AddInvoiceProductCommand {
  producto: IInvoiceProduct;
  productoRecuperacion?: IInvoiceProduct;
}
