export interface IRegisterPatientCommand {
  paciente: IPatientRegister;
  registroQuirofano?: IHospitalSpaceRecord;
  registroCuarto?: IHospitalSpaceRecord;
  id_Medico: string;
  procedimientos: string[];
  id_Paquete?: string;
  id_AlmacenPaquete?: string;
  articulosExtra?: IAccountItem[];
  servicios?: string[];
  equipoHonorario?: ITeamFee[];
}

export interface IPatientRegister {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: Date;
  genero?: string;
}

export interface IHospitalSpaceRecord {
  id_EspacioHospitalario: string;
  horaInicio: Date;
  horaFin: Date;
}

export interface IAccountItem {
  id_Articulo: string;
  cantidad: number;
}

export interface ITeamFee {
  nombre?: string;
  precio: number;
}
