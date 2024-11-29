import { ISurgicalProcedure } from '../admission/admissionTypes';
import { IBiomedicalEquipment } from '../hospitalizationTypes';

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
  equipoHonorario?: Pick<IBiomedicalEquipment, 'nombre' | 'precio'>[];
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

export interface IRegisterPagination {
  id_IngresoPaciente: string;
  id_Paciente: string;
  id_Medico: string;
  id_CuentaPaciente: string;
  clavePaciente?: string;
  cirugias?: ISurgicalProcedure[];
  nombrePaciente?: string;
  medico?: string;
  nombreEspacioHospitalario?: string;
  fechaProgramadaIngreso?: string;
  estatus: number;
  altaMedica: boolean;
}
