interface BaseEvent {
  id_CuentaEspacioHospitalario: string;
  horaInicio: string;
  horaFin: string;
  limpieza: Date;
}
export interface ISurgeryRoomReservation extends BaseEvent {
  nombreQuirofano: string;
  id_Quirofano: string;
}

export interface IHospitalRoomReservation extends BaseEvent {
  nombreCuarto: string;
  id_Cuarto: string;
}

