import { IBiomedicalEquipment } from '../hospitalizationTypes';
import { IRecoveryRoomOperatingRoom } from '../operatingRoom/operatingRoomTypes';
import { IRegisterPatientCommand } from '../programming/registerTypes';

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
  id: string;
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
  motivoIngreso?: string;
  diagnosticoIngreso?: string;
  alergias?: string;
  tipoSangre?: string;
  id_Medico?: string;
  nombreMedico?: string;
  espaciosHospitalarios: IHospitalSpace[];
  procedimientosQuirurgicos?: ISurgicalProcedure[];
}

export enum HospitalSpaceType {
  OperatingRoom = 1,
  Room = 2,
}

export interface IHospitalSpace {
  id_EspacioHospitalario: string;
  id_Espacio: string;
  nombreEspacioHospitalario: string;
  horaInicio: string;
  horaFin: string;
  finalizada: boolean;
  tipoEspacioHospitalario: number;
}

export interface ISurgicalProcedure {
  id_Cirugia: string;
  nombre: string;
  precio: number;
}

export interface ICuartosInfo {
  id_Cuarto: string;
  nombre: string;
  horaFin: string;
  horaInicio: string;
}

export interface IPatientRegisterPagination {
  id_IngresoPaciente: string;
  id_Paciente: string;
  id_Medico: string;
  clavePaciente?: string;
  cirugias?: ISurgicalProcedure[];
  nombrePaciente?: string;
  medico?: string;
  id_CuentaPaciente?: string;
  quirofano?: string;
  fechaProgramacion?: Date;
  procedimientos?: ISurgicalProcedure[];
  admitido: boolean;
  espaciosHospitalarios?: string[];
  estatus: number;
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
  id_TipoCuarto?: string;
  id_TipoQuirofano?: string;
  nombre: string;
  descripcion?: string;
  intervaloReservacion?: string;
  configuracionPrecioHora?: IRecoveryRoomOperatingRoom[];
  configuracionRecuperacion?: IRecoveryRoomOperatingRoom[];
  tipo: number;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
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

export interface ISAMInuevo {
  id_IngresoPaciente: string;
  id_Paciente: string;
  id_Medico: string;
  clavePaciente: string;
  nombrePaciente: string;
  medico: string;
  fechaIngreso: string;
  ingresoModulo: string;
  paciente:ISAMIPatient;
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

export interface IRegisterPatientAdmissionCommand {
  paciente: IPatientAdmissionDto;
  registroCuarto?: IHospitalSpaceRecordDto;
  id_Medico: string;
  procedimientos: string[];
  ingresosPaciente?: IPatientAdmissionEntranceDto;
}

export interface IPatientAdmissionDto {
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
  tipoSangre?: string;
  alergias?: string;
  curp?: string;
  estado?: string;
  ciudad?: string;
  nombreAseguradora?: string;
  aseguradora?: boolean;
}

export interface IPatientAdmissionEntranceDto {
  nombreResponsable?: string;
  parentesco?: string;
  domicilioResponsable?: string;
  coloniaResponsable?: string;
  codigoPostalResponsable?: string;
  telefonoResponsable?: string;
  motivoIngreso?: string;
  diagnosticoIngreso?: string;
  comentarios?: string;
  estadoResponsable?: string;
  ciudadResponsable?: string;
}

export interface IHospitalSpaceRecordDto {
  id_EspacioHospitalario: string;
  horaInicio: Date;
  horaFin: Date;
}

export interface IAdmitPatientCommand {
  id_IngresoPaciente: string;
  paciente?: IPatientAdmissionDto;
  responsablePaciente?: Omit<IPatientAdmissionEntranceDto, 'motivoIngreso' | 'diagnosticoIngreso' | 'comentarios'>;
  datosClinicos?: Pick<IPatientAdmissionEntranceDto, 'motivoIngreso' | 'diagnosticoIngreso' | 'comentarios'>;
}

export interface IPatientHospitalSpace
  extends Pick<IHospitalSpace, 'id_EspacioHospitalario' | 'tipoEspacioHospitalario'>,
    ICuartosInfo {
  estatus: number;
  id_TipoCuarto: string;
}

export interface IAdmissionDocInfo {
  clavePaciente?: string;
  nombrePaciente?: string;
  genero?: string;
  nombreMedico?: string;
  especialidadMedico?: string;
  diagnosticoIngreso?: string;
  motivoIngreso?: string;
  estadoCivil?: string;
  nombreResponsable?: string;
  direccion?: string;
  colonia?: string;
  codigoPostal?: string;
  procedimientos?: string[];
  domicilioResponsable?: string;
  codigoPostalResponsable?: string;
  coloniaResponsable?: string;
  nombreAnestesiologo?: string;
  parentesco?: string;
  telefono?: string;
  telefonoResponsable?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
  horaIngreso?: string;
  edad?: number;
  alergias?: string;
  cuarto?: string[];
  quirofano?: string[];
  sangre?: string;
  ciudad?: string;
  estado?: string;
}

export interface IPatientReentryInfo {
  paciente?: IPatientAdmissionDto & { id_Paciente: string };
  ingresoPaciente?: IPatientAdmissionEntranceDto & { id_IngresoPaciente: string };
  id_Medico?: string;
  cirugias?: string[];
  equipoHonorario?: Pick<IBiomedicalEquipment, 'nombre' | 'precio'>[];
}

export interface IRegisterPatientReentryCommand
  extends Pick<
    IRegisterPatientCommand,
    | 'articulosExtra'
    | 'equipoHonorario'
    | 'id_Medico'
    | 'id_Paquete'
    | 'procedimientos'
    | 'id_AlmacenPaquete'
    | 'servicios'
    | 'registroQuirofano'
  > {
  id_CuentaPaciente: string;
}
