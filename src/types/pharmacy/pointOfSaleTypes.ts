export interface ISale {
  id_VentaCaja: string;
  folio: string;
  usuarioVenta: string;
  estadoVenta: number;
  subTotal: number;
  iva: number;
  totalVenta: number;
  articulos: ISaleDetail[];
}

export interface ISaleDetail {
  id_Articulo: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  precioBruto: number;
  iva: number;
  totalVenta: number;
}
