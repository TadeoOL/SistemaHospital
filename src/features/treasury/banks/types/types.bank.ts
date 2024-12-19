import { IPurchaseOrder, IPurchaseOrderArticle } from '@/types/purchase/purchaseTypes';

export interface IBank {
  folio: number;
  concepto: string;
  cantidad: number;
  fechaIngreso: string;
}

export interface IBankFound {
  saldoTotal: number;
  cantidadVentas: number;
}

export interface IBankMovements {
  entradas: number[];
  salidas: number[];
  labels: string[];
}

export interface IBankPurchasesPending
  extends Omit<IPurchaseOrder, 'id_Proveedor' | 'id_Almacen' | 'notas' | 'ordenCompraArticulo' | 'estatus'> {
  id_MovimientoTesoreria: string;
  proveedor: string;
  ordenCompraArticulos: Pick<IPurchaseOrderArticle, 'nombre' | 'cantidad' | 'precioProveedor'>[];
}
