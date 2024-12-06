export interface IPatientAccountPagination {
  id_CuentaPaciente: string;
  nombreCompleto?: string;
  espaciosHospitalarios?: string[];
  medico?: string;
  fechaIngreso?: string;
  fechaCierreCuenta?: string;
  estatus: number;
  paseCaja: boolean;
  totalVenta: number;
}

export interface IPatientAccount {
  id: string;
  estatusCuenta: number;
  paciente?: IPatientInfo;
  cuartos?: IRoom[];
  quirofanos?: IOperatingRoom[];
  cirugias?: ISurgery[];
  servicios?: IService[];
  equipoHonorario?: IHonoraryTeam[];
  articulos?: IArticle[];
  pagosCuenta?: IAccountPayment[];
  subTotal: number;
  descuento: number;
  iva: number;
  total: number;
  totalPagos: number;
  totalRestante: number;
  subTotalDescuento: number;
  paseCaja: boolean;
  fechaIngreso: string;
  cuentaConCuarto: boolean;
}

export interface IPatientInfo {
  nombrePaciente?: string;
  nombreMedico?: string;
  fechaIngreso?: string;
  fechaCierreCuenta?: string;
}

export interface IRoom {
  id: string;
  nombre?: string;
  cantidadDias?: string;
  precioDia: number;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface IOperatingRoom {
  id: string;
  nombre?: string;
  tiempo?: string;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface ISurgery {
  id: string;
  nombre?: string;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface IService {
  id: string;
  nombre?: string;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface IHonoraryTeam {
  id: string;
  nombre?: string;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface IArticle {
  id: string;
  nombre?: string;
  solicitadoEn?: string;
  fechaSolicitado?: string;
  precioUnitario: number;
  cantidad: number;
  neto: number;
  iva: number;
  total: number;
  netoDescuento: number;
}

export interface IAccountPayment {
  id: string;
  folio?: string;
  fechaPago?: string;
  monto: number;
}

export enum PatientAccountStatus {
  Cancelled = 0,
  Scheduled = 1,
  Admitted = 2,
  Closed = 3,
  Paid = 4,
}

export const PatientAccountStatusLabels: Record<PatientAccountStatus, string> = {
  [PatientAccountStatus.Cancelled]: 'Cancelado',
  [PatientAccountStatus.Scheduled]: 'Programado',
  [PatientAccountStatus.Admitted]: 'Ingresado',
  [PatientAccountStatus.Closed]: 'Cerrada',
  [PatientAccountStatus.Paid]: 'Pagada',
};

export enum DepositType {
  Advance = 1,
  Settlement = 2,
}

export const DepositTypeLabels: Record<DepositType, string> = {
  [DepositType.Advance]: 'Anticipo',
  [DepositType.Settlement]: 'Liquidación',
};
