import { IBasicUserInformation } from "../userType";

export interface IHospitalRoomInformationPagination {
  id_Cuarto: string;
  id_CuentaEspacioHospitalario: string;
  id_IngresoPaciente: string;
  id_Paciente: string;
  nombrePaciente: string;
  nombreCuarto: string;
  medico: string;
  fechaIngreso: string;
  fechaSalida: string;
  enfermero: IBasicUserInformation;
}

export interface IClinicalDataHospitalRoom {
  diagnostico: string;
  alergias: string;
  motivoIngreso: string;
  comentarios: string;
  tipoSangre: string;
}

export interface IChargedItemsHospitalRoom {
  Id_Articulo: string;
  nombre: string;
  cantidad: number;
  fechaCargo: string;
  usuarioCargo: string;
}

export interface IHospitalRoomInformation {
  Id_Cuarto: string;
  nombrePaciente: string;
  nombreMedico: string;
  fechaIngreso: string;
  fechaSalida: string;
  nombreCuarto: string;
  enfermero?: IBasicUserInformation;
  datosClinicos?: IClinicalDataHospitalRoom;
  articulosCargados?: IChargedItemsHospitalRoom[];
}