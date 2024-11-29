export interface ISurgeryRoom {
  id_Quirofano: string;
  id_TipoQuirofano: string;
  tipoQuirofano: number;
  nombre: string;
  descripcion: string;
}

export interface ISurgeryRoomDetails {
  id_Quirofano: string;
  id_PaqueteQuirurgico: string;
  id_Medico: string;
  nombreQuirofano: string;
  horaInicio: Date;
  horaFin: Date;
  nombreMedico: string;
  nombrePaqueteQuirurgico: string;
  estado: number;
}

export enum SurgeryStatus {
  SurgeryCanceled = 0,
  SurgeryScheduled = 1,
  SurgeryStarted = 2,
  SurgeryFinished = 3,
  RecoveryStarted = 4,
  RecoveryFinished = 5,
  Surgeries = 6,
  Recoveries = 7,
}

export const SurgeryStatusLabel = {
  [SurgeryStatus.SurgeryCanceled]: 'Cirugía Cancelada',
  [SurgeryStatus.SurgeryScheduled]: 'Cirugía Programada',
  [SurgeryStatus.SurgeryStarted]: 'Cirugía Iniciada',
  [SurgeryStatus.SurgeryFinished]: 'Cirugía Finalizada',
  [SurgeryStatus.RecoveryStarted]: 'Recuperación Iniciada',
  [SurgeryStatus.RecoveryFinished]: 'Recuperación Finalizada',
  [SurgeryStatus.Surgeries]: 'Cirugías',
  [SurgeryStatus.Recoveries]: 'Recuperaciones',
};
