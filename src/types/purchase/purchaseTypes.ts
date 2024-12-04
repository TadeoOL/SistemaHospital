export interface IPurchaseOrderArticle {
  id_OrdenCompraArticulo: string;
  id_Articulo: string;
  cantidad: number;
  nombre?: string;
  codigoBarras?: string;
  precioProveedor: number;
  //solo para entrada de articulos
  fechaCaducidad?: string;
  unidadesTotal?: number;
}

export interface IPurchaseOrderPagination {
  id_OrdenCompra: string;
  folio_Extension?: string;
  usuarioSolicitado?: string;
  proveedor?: string;
  fechaSolicitud?: string;
  total?: string;
  estatusConcepto?: string;
  estatus: number;
  fueAutorizada?: boolean;
  cotizacion: boolean;
  articulos?: IPurchaseOrderArticle[];
}

export interface IPurchaseOrder {
  id_OrdenCompra: string;
  id_Proveedor: string;
  id_Almacen: string;
  usuario?: string;
  estatus: number;
  folio: string;
  precioTotalOrden: number;
  conceptoPago: number;
  notas?: string;
  ordenCompraArticulo?: IPurchaseOrderArticle[];
  fechaCreacion: string;
}

export interface IPurchaseAuthorizationHistory {
  id_OrdenCompra: string;
  usuarioSolicito?: string;
  usuarioAutorizo?: string;
  nombreProveedor?: string;
  nombreAlmacen?: string;
  estatus: number;
  estatusConcepto?: string;
  folio?: string;
  conceptoPago: number;
  notas?: string;
  precioTotalOrden: number;
  fechaSolicitud?: Date | string;
  fechaAutorizacion?: Date | string;
  ordenCompraArticulo?: IPurchaseOrderArticle[];
}
