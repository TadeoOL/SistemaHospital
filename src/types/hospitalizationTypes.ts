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

export interface IAcountAllInformation {
  id: string;//ID del registro
  cuartos: IRoomsAccount[];
  quirofanos: IOperatingRoomsAccount[];
  procedimientos: IProceduresAccount[];
  registrosRadiografias: IXRaysAccount[];
  registrosEquiposBiomedicos: IBiomedicalEquipmentAccount[];
  registrosEquiposBiomedicosHonorario: IExternalBiomedicalEquipmentAccount[];
  paciente: IPatientInAccount;
  articulos: IArticlesAccount[];
  pagosCuenta: IPaymentsAccount[];
  totalPagoCuenta: number;
  totalPagoCuentaAbonos: number;
  totalPagoCuentaRestante: number;
}

export interface IAcountAllInformationAdmission {
  id: string;//ID del registro
  id_CuentaPaciente: string;
  cuartos: IRoomsAccount[];
  quirofanos: IOperatingRoomsAccount[];
  procedimientos: IProceduresAccount[];
  registrosRadiografias: IXRaysAccount[];
  registrosEquiposBiomedicos: IBiomedicalEquipmentAccount[];
  registrosEquiposBiomedicosHonorario: IExternalBiomedicalEquipmentAccount[];
  paciente: IPatientInAccount;
  articulos: IArticlesAccount[];
  totalPagoCuenta: number;
}
export interface IRoomsAccount {
  id_RegistroCuarto: string;
  nombre: string;
  cantidadDias: string;
  precioDia: number;
  precioTotal: number;
} 
export interface IOperatingRoomsAccount {
  id_RegistroCuarto: string;
  nombre: string;
  tiempoCirugia: string;
  precioHora: number;
  precioTotal: number;
} 
export interface IProceduresAccount {
  id: string;
  nombre: string;
  duracionCirujia: string;
  duracionHospitalizacion: number;
  precio: number;
} 
export interface IXRaysAccount {
  id_RegistroRadiografia: string;
  nombre: string;
  nombreSolicitante: string;
  precio: number,
  estatus: number,
  folio: string,
} 
export interface IBiomedicalEquipmentAccount {
  id_RegistroEquipoBiomedico: string;
  nombre: string;
  precio: number;
} 
export interface IExternalBiomedicalEquipmentAccount {
  id_Medico: string;
  nombre: string;
  precio: number;
} 
export interface IPatientInAccount {
  nombre: string;
  edad: number;
  genero: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  id: string;
} 
export interface IArticlesAccount {
  id: string;
  nombre: string;
  cantidad: number;
  precioVenta: number;
}
export interface IPaymentsAccount {
  id: string;
  folio: string;
  pagado: boolean;
  total: number;
}