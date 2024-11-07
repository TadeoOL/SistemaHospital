import { HistorialClinico, Paciente } from '../admission/admissionTypes';
import { IAnesthesiologist, IMedic } from '../hospitalizationTypes';
import { IHospitalSpaceRecord } from '../programming/registerTypes';

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

//nuevo
export interface IRoomInformationnew {
  id_IngresoPaciente: string;
  estatus: number;
  quirofano: string;
  paciente?: string;
  cirugias?: string;
  medico?: string
  anestesiologo?: string;
  TiempoEstimado?: string;
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


///////// - ADMISSION - /////////

export interface IRegisterPatientAdmissionCommand {
  paciente: IAdmissionPatient;
  registroCuarto?: IHospitalSpaceRecord;
  id_Medico: string;
  procedimientos: string[];
  ingresosPaciente?: IPatientAdmission;
}

export interface IAdmissionPatient {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: Date;
  genero?: string;
  estadoCivil?: string;
  telefono?: string;
  ocupacion?: string;
  codigoPostal?: string;
  colonia?: string;
  direccion?: string;
}

export interface IPatientAdmission {
  nombreResponsable?: string;
  parentesco?: string;
  domicilioResponsable?: string;
  coloniaResponsable?: string;
  estado?: string;
  ciudad?: string;
  codigoPostalResponsable?: string;
  telefonoResponsable?: string;
}

