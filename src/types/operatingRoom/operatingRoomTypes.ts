import { HistorialClinico, Paciente } from '../admission/admissionTypes';
import { IChargedItemsHospitalRoom, IClinicalDataHospitalRoom } from '../hospitalization/hospitalRoomTypes';
import { IAnesthesiologist, IMedic } from '../hospitalizationTypes';

export interface IOperatingRoomConfig {
  configuracionRecuperacion: IRecoveryRoomOperatingRoom[];
}

export interface IRecoveryRoomOperatingRoom {
  horaInicio: string;
  horaFin: string | null;
  precio: string;
}

export interface IPriceConfigRooms{
  horaInicio: string;
  horaFin?: string;
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
  id_CuentaEspacioHospitalario: string;
  estatus: number;
  quirofano: string;
  paciente?: string;
  cirugias?: { id_Cirugia: string; nombre: string }[];
  id_Enfermero?: string; 
  enfermero?: string;
  medico?: string
  id_Medico?: string;
  id_Anestesiologo?: string;
  anestesiologo?: string;
  tiempoEstimado?: string;
  horaInicioRecuperacion?: string;
  horaFinRecuperacion?: string;
  horaInicio: string;
  horaFin: string;
  motivoIngreso?: string;
  altaMedica: boolean;
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

// export interface IRegisterPatientAdmissionCommand {
//   paciente: IAdmissionPatient;
//   registroCuarto?: IHospitalSpaceRecord;
//   id_Medico: string;
//   procedimientos: string[];
//   ingresosPaciente?: IPatientAdmission;
// }

// export interface IAdmissionPatient {
//   nombre?: string;
//   apellidoPaterno?: string;
//   apellidoMaterno?: string;
//   fechaNacimiento?: Date;
//   genero?: string;
//   estadoCivil?: string;
//   telefono?: string;
//   ocupacion?: string;
//   codigoPostal?: string;
//   colonia?: string;
//   direccion?: string;
// }

// export interface IPatientAdmission {
//   nombreResponsable?: string;
//   parentesco?: string;
//   domicilioResponsable?: string;
//   coloniaResponsable?: string;
//   estado?: string;
//   ciudad?: string;
//   codigoPostalResponsable?: string;
//   telefonoResponsable?: string;
// }

export interface IOperatingRoomInformation {
  datosClinicos?: IClinicalDataHospitalRoom;
  articulosCargados?: IChargedItemsHospitalRoom[];
}
