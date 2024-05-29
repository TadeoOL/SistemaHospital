import axios from '../../libs/axios';
import { IEventDetails } from '../../types/admissionTypes';
const apiRegister = '/api/Registro';

interface RegisterAdmission {
  pacienteId: string;
  historialClinicoId: string;
  procedimientos: string[];
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
