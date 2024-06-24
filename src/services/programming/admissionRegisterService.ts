import axios from '../../libs/axios';
import { IEventDetails } from '../../types/admissionTypes';
const apiRegister = '/api/Registro';

interface RegisterAdmission {
  pacienteId: string;
  historialClinicoId: string;
  id_Medico: string;
  id_Anestesiologo: string;
  procedimientos: string[];
  radiografias: string[];
  equiposBiomedico: string[];
  equipoBiomedicoHonorario?: string;
  articulos: { articuloId: string; cantidad: number; notas?: string }[];
  fechaInicio: Date;
  fechaFin: Date;
  cuartos: Cuarto[];
}

interface Cuarto {
  cuartoId: string;
  horaInicio: Date;
  horaFin: Date;
  tipoCuarto: string;
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
