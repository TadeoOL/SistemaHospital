export interface IAssignedRoomsPagination {
  id_Cuarto: string;
  id_IngresoPaciente: string;
  id_EspacioHospitalario: string;
  id_CuentaPaciente: string;
  id_Paciente: string;
  nombrePaciente: string;
  nombreCuarto: string;
  medico: string;
  alergias: string | null;
  comentarios: string | null;
  diagnosticoIngreso: string | null;
  edad: number;
  genero: 'Hombre' | 'Mujer';
  motivoIngreso: string | null;
  tipoSangre: string | null;
}

export interface IPatientKardex {
  id: string;
  fechaKardex: string;
  indicacionesMedicas?: string;
  dieta?: string;
  dietaObservaciones?: string;
  observaciones?: string;
  medicamentos: IKardexMedicine[];
  servicios: IKardexService[];
}

export interface IKardexMedicine {
  id_Articulo?: string;
  nombreMedicamento?: string;
  frecuencia?: string;
  dosis?: string;
  via?: string;
  horario?: string;
}

export interface IKardexService {
  id_Servicio: string;
  nombreServicio?: string;
  indicaciones?: string;
}

export interface ICreateKardexCommand {
    id_IngresoPaciente: string;
    indicacionesMedicas?: string;
    dieta?: string;
    dietaObservaciones?: string;
    observaciones?: string;
    medicamentos?: IKardexMedicineRequest[];
    servicios?: IKardexServiceRequest[];
}

export interface IKardexMedicineRequest {
    id_Articulo?: string ;
    frecuencia?: string;
    dosis?: string;
    via?: string;
    horario?: string;
    nombreMedicamento?: string;
}

export interface IKardexServiceRequest {
    id_Servicio?: string;
    indicaciones?: string;
    nombreServicio?: string;
}

export interface IPatientInfo {
  id: string;
  nombre: string;
  habitacion: string;
  medico: string;
}
