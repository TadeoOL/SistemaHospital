export interface IAdministrationMovement {
  id_VentaCaja: string;
  folio: string;
  concepto: string;
  cantidad: number;
  fechaIngreso: string;
  tipoPago: string;
}
export interface IAdministrationMovementHistory {
  id_MovimientoTesoreria: string;
  folio: string;
  cantidad: number;
  concepto: string;
  fecha: string;
  notas?: string;
  tipoPago: string;
}
