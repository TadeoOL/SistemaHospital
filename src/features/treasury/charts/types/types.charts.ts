import { IAdministrationMovement } from '../../administration/types/types.administration';

export interface SellsAndMovementsAdministration {
  totalIngresos: number;
  ingresosAyer: number;
  ingresosSemana: number;
  detalles: Omit<IAdministrationMovement, 'id_VentaCaja' | 'tipoPago'>[];
  ingresosPorSemana: number[];
}

export interface IMovements {
  entradas: number[];
  salidas: number[];
  labels: string[];
}
