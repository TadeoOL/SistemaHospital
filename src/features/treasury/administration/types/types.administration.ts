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

export interface ICreateAuthorizationCommand {
  id_ConceptoSalida: string;
  cantidad: number;
  motivo: string;
}

export interface IAdministrationFund {
  saldo: number;
  cantidadVentas: number;
}

export interface SellsAndMovementsAdministration {
  totalIngresos: number;
  ingresosAyer: number;
  ingresosSemana: number;
  detalles: Omit<IAdministrationMovement, 'id_VentaCaja' | 'tipoPago'>[];
  ingresosPorSemana: number[];
}
