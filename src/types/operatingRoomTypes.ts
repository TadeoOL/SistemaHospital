import { HistorialClinico, Paciente } from './admissionTypes';
import { IAnesthesiologist, IMedic } from './hospitalizationTypes';

export interface IOperatingRoomConfig {
  configuracionRecuperacion: IRecoveryRoomOperatingRoom[];
}

export interface IRecoveryRoomOperatingRoom {
  inicio: string;
  fin: string | null;
  precio: string;
}

export interface IRoomInformation {
  id: string;
  nombre: string;
  medico?: IMedic;
  anestesiologo?: IAnesthesiologist;
  procedimientos?: { id: string; nombre: string }[];
  enfermeros?: { id_Enfermero: string; nombre: string }[];
  registroQuirofano?: IRegisterOperatingRoom;
  paciente?: Paciente;
  horaInicio: Date;
  horaFin: Date;
  datosClinicos?: HistorialClinico;
}

export interface IRegisterOperatingRoom {
  id: string;
  id_RegistroCuarto: string;
  horaInicio: Date;
  horaFin: Date;
  nombreEnfermero?: string;
  id_Enfermero?: string;
  horaInicioRecuperacion?: Date;
  horaFinRecuperacion?: Date;
}

export interface ISurgeryHistory {
  id: string;
  nombre: string;
  medico: string;
  anestesiologo: string;
  procedimientos: { id: string; nombre: string }[];
  enfermeros: { id_Enfermero: string; nombre: string }[];
  paciente: string;
  horaInicio: Date;
  horaFin: Date;
  duracion: string;
}

export interface IRecoveryRoom {
  id: string;
  nombre: string;
  medico: string;
  anestesiologo: string;
  paciente: Paciente;
  horaInicio: Date;
  horaFin: Date;
  datosClinicos: HistorialClinico;
  procedimientos: { id: string; nombre: string }[];
}
