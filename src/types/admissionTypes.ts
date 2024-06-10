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
}

export interface HistorialClinico {
  id: string;
  id_Paciente: string;
  medicoTratante: string;
  especialidad: string;
  motivoIngreso: string;
  diagnosticoIngreso: string;
  procedimiento: string;
  comentarios: string;
}

export interface Paciente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: number;
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
}

export interface IPatientRegisterPagination {
  id: string;
  clavePaciente: string;
  nombrePaciente: string;
  fechaIngreso: Date;
  id_Paciente: string;
  id_HistorialClinico: string;
  faltanDatos?: boolean;
}
