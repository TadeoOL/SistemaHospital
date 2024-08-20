import { IRecoveryRoomOperatingRoom } from './operatingRoomTypes';

export interface IEventDetails {
  id: string;
  horaInicio: string;
  horaFin: string;
  cuarto: Cuarto;
  procedimiento: Procedimiento[];
  historialClinico: HistorialClinico;
  paciente: Paciente;
}

export interface Cuarto {
  tipoCuarto: string;
  nombre: string;
  descripcion: string;
  registroCuartos: any;
  id: string;
  fechaCreacion: string;
  fechaModificacion: string;
  habilitado: boolean;
}

export interface Procedimiento {
  id: string;
  nombre: string;
  duracionCirujia: string;
  duracionHospitalizacion: string;
  descripcion: string;
  precio?: number;
}

export interface HistorialClinico {
  id: string;
  id_Paciente: string;
  motivoIngreso: string;
  diagnosticoIngreso: string;
  comentarios: string;
  tipoSangre: string;
  alergias: string;
}

export interface Paciente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  fechaNacimiento: Date;
  estadoCivil: string;
  telefono: string;
  ocupacion: string;
  codigoPostal: string;
  colonia: string;
  direccion: string;
  nombreResponsable: string;
  parentesco: string;
  domicilioResponsable: string;
  coloniaResponsable: string;
  codigoPostalResponsable: string;
  telefonoResponsable: string;
  estado: string;
  ciudad: string;
  id: string;
}

export interface PacienteInfo {
  //Agregar mas cosas
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  fechaNacimiento: Date;
  estadoCivil: string;
  telefono: string;
  ocupacion: string;
  codigoPostal: string;
  colonia: string;
  direccion: string;
  nombreResponsable: string;
  parentesco: string;
  domicilioResponsable: string;
  coloniaResponsable: string;
  codigoPostalResponsable: string;
  telefonoResponsable: string;
  id: string;
  informacionCuartos?: ICuartosInfo[];
  ingresoSami: boolean;
}

export interface ICuartosInfo {
  id_Cuarto: string;
  nombre: string;
  horaFin: string;
  horaInicio: string;
}

export interface IPatientRegisterPagination {
  id: string;
  clavePaciente: string;
  nombrePaciente: string;
  fechaIngreso: Date;
  id_Paciente: string;
  id_HistorialClinico: string;
  faltanDatos?: boolean;
  admitido?: boolean;
  procedimientos?: Procedimiento[];
  cuartos?: string;
  medico?: string;
  id_Medico?: string;
}

export interface IPatientAccount {
  id_Paciente: string;
  nombreCompleto: string;
  cuartos: string;
  medico: string;
  id_Cuenta: string;
  id_ArticuloCuenta: string | null;
  estatus: number;
  fechaApertura: string;
}
export interface IProgrammingRequestPagination {
  id: string;
  id_Paciente: string;
  id_Medico: string;
  nombrePaciente: string;
  nombreMedico: string;
  fechaSugerida: Date;
  recomendacionMedica: boolean;
  notas?: string;
  procedimientos: { id: string; nombre: string }[];
}

export interface ITypeRoom {
  id: string;
  nombre: string;
  descripcion?: string;
  configuracionLimpieza?: string;
  configuracionPrecioHora?: IRecoveryRoomOperatingRoom[];
  configuracionRecuperacion?: IRecoveryRoomOperatingRoom[];
  tipo: number;
  precio?: number;
}

export interface IDocumentsInfo {
  paciente: Paciente;
  nombreMedico: string;
  especialidad: string;
  diagnosticoIngreso: string;
  motivoIngreso: string;
  fechaIngreso: string;
  horaIngreso: string;
  procedimientos: string;
  clavePaciente: string;
  alergias: string;
  sangre: string;
  nombreCuarto: string;
  nombreQuirofano: string;
  nombreAnestesiologo: string;
  tipoSangre: string;
}

export interface ISAMI {
  id: string;
  paciente: ISAMIPatient;
  fechaIngreso: string;
  admitido: boolean;
}

export interface ISAMIPatient {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  telefono: string;
  id: string;
  direccion: string;
  colonia: string;
  codigoPostal: string;
  nombreResponsable: string;
  estadoCivil: string;
}
