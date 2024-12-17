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
