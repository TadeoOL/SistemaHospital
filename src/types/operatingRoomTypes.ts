import { Paciente } from './admissionTypes';
import { IAnesthesiologist, IMedic } from './hospitalizationTypes';

export interface IOperatingRoomConfig {
  configuracionQuirofano: IRecoveryRoomOperatingRoom[];
  configuracionRecuperacion: IRecoveryRoomOperatingRoom[];
}

export interface IRecoveryRoomOperatingRoom {
  inicio: string;
  fin: string | null;
  precio: string;
}

export interface IDailyOperatingRoom {
  nombre: string;
  medico: IMedic;
  anestesiologo: IAnesthesiologist;
  paciente: Paciente;
  horaInicio: Date;
  horaFin: Date;
}
