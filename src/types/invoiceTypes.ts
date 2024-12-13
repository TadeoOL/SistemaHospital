import { IInvoiceItem } from "./hospitalizationTypes";

export interface InvoicePatientBillPagination {
  id_CuentaPaciente: string;
  //id_Paciente: string;
  clavePaciente: string;
  paciente: string;
  medico: string;
  cirugias: string[];
  facturada: boolean;
}

export interface InvoiceSellInvoicePagination {
  id_VentaCaja: string;
  folio: string;
  subTotal: string;
  iva: string;
  total: string;
  metodoPago: string;
  fechaCompra: string;
  pedidoRelacionado: string | null;
  facturacionRelacionada: string | null;
  facturada: boolean;
  articulos: InvoiceSellInvoiceArticle[];
}
export interface InvoiceSellInvoiceArticle {
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  unitario: string;
  subTotal: string;
  iva: string;
  total: string;
}

export interface PharmacySellInvoice {
  id: string;
  nombrePaciente: string;
  subTotal: number;
  iva: number;
  total: number;
  facturable: boolean;
  productosFactura: IInvoiceItem[];
}