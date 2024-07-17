export interface IBiomedicalEquipment {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  esPersonal?: boolean;
}

export interface IAnesthesiologist {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}

export interface IXRay {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface IXRayRequest {
  id: string;
  folio: string;
  id_Solicitante: string;
  nombreSolicitante: string;
  nombrePaciente: string;
  nombre: string;
  precio: number;
  fechaSolicitud: string;
  estatus: number;
}

export interface IMedic {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  edad: number;
  fechaNacimiento: Date;
}

export interface IMedicalShift {
  id: string;
  id_Medico: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface IAnesthesiologistShift {
  id: string;
  id_Anestesiologo: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
}
