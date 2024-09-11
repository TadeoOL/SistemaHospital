export interface IBiomedicalEquipment {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  esPersonal?: boolean;
  notas?: string;
  codigoContpaqi?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: string;
}

export interface IAnesthesiologist {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
}

export interface IXRay {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: number;
  codigoContpaqi?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: string;
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
  tipo: number;
}

export interface IMedic {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
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
  id: string; //ID del registro
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
  subtotalPagoCuenta: number;
  totalPagoCuentaAbonos: number;
  totalPagoCuentaRestante: number;
  subtotalPagoCuentaRestante: number;
  porcentajeDescuento: number;
  totalPagoSami: number;
  medico: string;
  tipoOperacion: string;
  iva: number;
  subTotal: number;
  esHospitalizacion: boolean;
  ventaConcepto: number;
  ventaArticuloSinIVA: number;
  ventaArticuloIVA: number;
}

export interface IAcountAllInformationAdmission {
  id: string; //ID del registro
  id_CuentaPaciente: string;
  cuartos: IRoomsAccount[];
  quirofanos: IOperatingRoomsAccount[];
  procedimientos: IProceduresAccount[];
  registrosRadiografias: IXRaysAccount[];
  registrosEquiposBiomedicos: IBiomedicalEquipmentAccount[];
  registrosEquiposBiomedicosHonorario: IExternalBiomedicalEquipmentAccount[];
  paciente: IPatientInAccount;
  pagosCuenta: IPaymentsAccount[];
  articulos: IArticlesAccount[];
  subtotalPagoCuenta: number;
  totalPagoCuenta: number;
  totalPagoCuentaAbonos?: number;
  totalPagoCuentaRestante?: number;
  subtotalPagoCuentaRestante: number;
  medico: string;
  tipoOperacion: string;
  iva: number;
  subTotal: number;
  esHospitalizacion: boolean;
  ventaConcepto: number;
  ventaArticuloSinIVA: number;
  ventaArticuloIVA: number;
}
export interface IRoomsAccount {
  id_RegistroCuarto: string;
  nombre: string;
  cantidadDias: string;
  precioDia: number;
  precioTotal: number;
  precioNeto: number;
  precioIVA: number;
}
export interface IOperatingRoomsAccount {
  id_RegistroCuarto: string;
  nombre: string;
  tiempoCirugia: string;
  precioHora: number;
  precioTotal: number;
  precioNeto: number;
  precioIVA: number;
}
export interface IProceduresAccount {
  id: string;
  nombre: string;
  duracionCirujia: string;
  duracionHospitalizacion: number;
  precio: number;
  precioNeto?: number;
  precioIVA?: number;
}
export interface IXRaysAccount {
  id_RegistroRadiografia: string;
  nombre: string;
  nombreSolicitante: string;
  precio: number;
  estatus: number;
  folio: string;
  precioNeto?: number;
  precioIVA?: number;
}
export interface IBiomedicalEquipmentAccount {
  id_RegistroEquipoBiomedico: string;
  nombre: string;
  precio: number;
  precioIVA?: number;
  precioNeto?: number;
}
export interface IExternalBiomedicalEquipmentAccount {
  id_Medico: string;
  nombre: string;
  precio: number;
  precioIVA?: number;
  precioNeto?: number;
}
export interface IPatientInAccount {
  nombre: string;
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
  precioNeto: number;
  precioIVA: number;
  precioTotal: number;
  solicitud: string;
  fechaSolicitado: string;
}
export interface IPaymentsAccount {
  id: string;
  folio: string;
  fechaPago: string;
  pagado: boolean;
  total: number;
}

export const REQUEST_TYPES: Record<number, string> = {
  1: 'Laboratorio',
  2: 'Radiografía',
  3: 'Ultra Sonido',
  4: 'SAMI',
  5: 'Electrocardiograma',
  6: 'Cuidado Neonatal',
};

export interface IRequestConfig {
  id_Usuario: string;
  nombre: string;
  solicitudes: number[];
}

export const DISCOUNT_TYPES = {
  Porcentaje: 1,
  Monto: 2,
} as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];
export type DiscountTypeKey = keyof typeof DISCOUNT_TYPES;

export interface IDiscount {
  id: string;
  id_CuentaPaciente: string;
  montoDescuento: number;
  motivoDescuento: string;
  tipoDescuento: DiscountTypeKey;
  usuarioEncargadoDescuento: { id: string; nombre: string };
  fechaCreacion: string;
  fechaModificacion: string;
}
