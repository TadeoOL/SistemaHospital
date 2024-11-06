import axios from '../../libs/axios';
import { IOperatingRoomConfig } from '../../types/operatingRoom/operatingRoomTypes';
const apiOperatingRoomRegisterConfig = '/api/RegistroQuirofano';

export const createOperatingRoomRegister = async (data: { id_RegistroCuarto: string; horaInicio: Date }) => {
  const res = await axios.post(`${apiOperatingRoomRegisterConfig}/crear-registro-quirofano`, data);
  return res.data as IOperatingRoomConfig;
};

export const modifyOperatingRoomRegister = async (data: {
  id_RegistroQuirofano: string;
  horaInicio?: Date;
  horaFin?: Date;
  horaInicioRecuperacion?: Date;
  horaFinRecuperacion?: Date;
  Enfermero?: { id_Enfermero: string; nombre: string };
}) => {
  const res = await axios.put(`${apiOperatingRoomRegisterConfig}/modificar-registro-quirofano`, data);
  return res.data as IOperatingRoomConfig;
};

export const getRecoveryRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiOperatingRoomRegisterConfig}/paginacion-paciente-recuperacion?${params}`);
  return res.data;
};

export const getAllOperatingRoomsTypes = async () => {
  const res = await axios.get(`${apiOperatingRoomRegisterConfig}/lista-tipos-quirofanos`);
  return res.data;
};
