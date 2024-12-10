export interface IBiomedicalEquipment {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  esPersonal?: boolean;
  notas?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
}

export interface IAnesthesiologist {
  id_Anestesiologo: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
}

export interface IService {
  id_Servicio: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: number;
  requiereAutorizacion: boolean;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  tipoProducto?: number;
  codigoProducto?: string;
  id_ProductoFactura?: string;
  iva?: boolean;
}

export interface IServiceRequest {
  id: string;
  folio: string;
  id_Paciente: string;
  paciente: string;
  id_Solicitante: string;
  enfermero: string;
  servicio: string;
  //precio: number;
  fechaSolicitud: string;
  estatus: number;
  tipo: number;
  //tipo: number;
}

export interface IMedic {
  id: string;
  nombre: string;
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
  totalPagoCuentaOriginal: number;
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
  cantidadDias: number;
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
  5: 'Electrocardiograma',
  6: 'Cuidado Neonatal',
  7: 'Consulta Médica',
  8: 'Otros',
};

export interface IRequestConfig {
  id_Usuario: string;
  nombre: string;
  tipoServicio: number[];
}
/////////////
export interface IAcountFullInformation {
  id: string;
  paciente: IAcountPatient;
  cuartos: IAcountRooms[];
  quirofanos: IAcountQuirurgicalRooms[];
  cirugias: IAcountSurgeries[];
  servicios: IAcountServices[];
  equipoHonorario: IAcountEquipment[];
  articulos: IAcountArticles[];
  pagosCuenta: IAcountPayments[];
  subTotal: number;
  descuento: number | null;
  iva: number;
  total: number;
  totalPagos: number;
  facturable: boolean;
}

export interface IAcountPatient {
  nombrePaciente: string;
  nombreMedico: string;
  fechaIngreso: string;
  fechaCierraCuenta: string;
}
export interface IAcountRooms {
  id: string;
  nombre: string;
  cantidadDias: number;
  precioDia: number;
  neto: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}

export interface IAcountQuirurgicalRooms {
  id: string;
  nombre: string;
  tiempo: string;
  neto: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}

export interface IAcountSurgeries {
  id: string;
  nombre: string;
  neto: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}
export interface IAcountArticles {
  id: string;
  nombre: string;
  solicitadoEn: string;
  fechaSolicitado: string;
  precioUnitario: number;
  neto: number;
  cantidad: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}
export interface IAcountServices {
  id: string;
  nombre: string;
  neto: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}
export interface IAcountEquipment {
  id: string;
  nombre: string;
  neto: number;
  netoDescuento: number | null;
  iva: number;
  total: number;
  productoFacturacion: string | null;
}
export interface IAcountPayments {
  id: string;
  Folio: string;
  FechaPAgo: string;
  Monto: number;
}
