export enum MovementType {
  ENTRADAS = 1,
  SALIDAS = 2,
  TRANSFERENCIAS = 3,
  DEPOSITOS = 4,
}

export enum MovementArea {
  REVOLVENTE = 1,
  BANCO = 2,
  DIRECCION = 3,
  CAJA = 4,
}

export interface ITreasuryMovement {
  id: string;
  id_Origen: number;
  id_Destino: number;
  id_TipoMovimiento: number;
  id_Venta?: string;
  fechaDeposito?: string;
  monto: number;
  notas?: string;
  fechaCreacion: string;
  fechaModificacion: string;
  habilitado: boolean;
}
