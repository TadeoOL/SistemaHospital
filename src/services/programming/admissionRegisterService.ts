import axios from '../../libs/axios';
import { IEventDetails } from '../../types/admissionTypes';
const apiRegister = '/api/Programacion/Registro';

interface RegisterAdmission {
  pacienteId: string;
  historialClinicoId: string;
  id_Medico: string | null;
  id_Anestesiologo?: string | null;
  procedimientos: string[];
  motivoRechazo?: string;
  radiografias?: string[] | null;
  equiposBiomedico: string[];
  equipoBiomedicoHonorario?: string;
  articulos: { articuloId: string; cantidad: number; notas?: string }[];
  fechaInicio: Date;
  fechaFin: Date;
  cuartos: Cuarto[];
  estudiosGabinete?: string[];
}

interface Cuarto {
  cuartoId: string;
  horaInicio: Date;
  horaFin: Date;
  id_TipoCuarto: string;
}

export const createAdmission = async (data: RegisterAdmission) => {
  const res = await axios.post(`${apiRegister}/registrar-admision`, data);
  return res.data;
};

export const getEventDetails = async (eventId: string) => {
  const res = await axios.get(`${apiRegister}/informacion-registro-cuarto`, {
    params: {
      id_RegistroCuarto: eventId,
    },
  });
  return res.data as IEventDetails;
};

export const getPatientRegisterPagination = async (params: string) => {
  const res = await axios.get(`${apiRegister}/paginacion-registros?${params}`);
  return res.data;
};

export const getRegisterRoomsByRegisterId = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/registros-cuartos`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data;
};

export const modifyEventRoom = async (data: {
  id_RegistroCuarto: string;
  id_Cuarto: string;
  horaInicio: Date;
  horaFin: Date;
}) => {
  const res = await axios.put(`${apiRegister}/modificar-registro-cuarto`, data);
  return res.data;
};

export const modifyOperatingRoom = async (data: {
  id_RegistroCuarto: string;
  id_Medico?: string;
  id_Anestesiologo?: string;
  enfermeros?: string;
}) => {
  const res = await axios.put(`${apiRegister}/modificar-datos-quirofano`, data);
  return res.data;
};

export const deleteRegister = async (registerId: string) => {
  const res = await axios.delete(`${apiRegister}/eliminar-registro`, {
    params: {
      Id_Registro: registerId,
    },
  });
  return res.data;
};

export const getAccountFullInformation = async (params: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-completa-registro?${params}`);
  return res.data;
};

export const getAccountAdmissionInformation = async (params: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-admision?${params}`);
  return res.data;
};

export const closeRegisterAndAccount = async (data: {
  Id_Registro: string;
  Id_Paciente: string;
  Id_CuentaPaciente: string;
  TotalCuenta: number;
  SubTotal: number;
  IVA: number;
}) => {
  const res = await axios.put(`${apiRegister}/cerrar-registro`, data);
  return res.data;
};

export const admitRegister = async (data: { Id_Registro: string }) => {
  const res = await axios.put(`${apiRegister}/admitir-registro`, data);
  return res.data;
};

export const getDocumentData = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/obtener-informacion-documentos`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data;
};

export const addRegisterRoom = async (data: {
  id_Registro: string;
  Cuartos: {
    cuartoId: string;
    horaInicio: Date;
    horaFin: Date;
  }[];
}) => {
  const res = await axios.put(`${apiRegister}/agregar-registro-cuarto`, data);
  return res.data;
};

export const editRegisterProcedures = async (data: { id_Registro: string; id_Procedimientos: string[] }) => {
  const res = await axios.put(`${apiRegister}/editar-registro-procedimientos`, data);
  return res.data;
};

export const modifyRoomsEvents = async (data: {
  id_Registro: string;
  listaRegistrosCuartos: { id_RegistroCuarto: string; fechaInicio: Date; fechaFin: Date; id_Cuarto: string }[];
}) => {
  const res = await axios.put(`${apiRegister}/modificar-lista-registros-cuartos`, data);
  return res.data;
};

export const getRegisterValidation = async (registerId: string) => {
  const res = await axios.get(`${apiRegister}/validar-registro`, {
    params: {
      id_Registro: registerId,
    },
  });
  return res.data as boolean;
};

export const addMedicToRegister = async (data: { id_Registro: string; id_Medico: string }) => {
  const res = await axios.put(`${apiRegister}/agregar-medico-registro`, data);
  return res.data;
};
