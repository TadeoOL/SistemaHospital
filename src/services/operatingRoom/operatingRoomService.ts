import { SurgeryStatus } from '@/types/programming/surgeryRoomTypes';
import axios from '../../libs/axios';
import { IOperatingRoomConfig, IOperatingRoomInformation } from '../../types/operatingRoom/operatingRoomTypes';
const apiOperatingRoomConfig = '/api/ConfiguracionQuirofano';
const OperatingRoomCon = '/api/Quirofano';

export const getOperatingRoomConfig = async () => {
  const res = await axios.get(`${apiOperatingRoomConfig}/obtener-configuracion-quirofano`);
  return res.data as IOperatingRoomConfig;
};

export const modifyOperatingRoom = async (data: {
  id_CuentaEspacioHospitalario: string;
  id_Medico?: string;
  id_Anestesiologo?: string;
  id_EnfermeroEncargado?: string;
}) => {
  const res = await axios.put(`${OperatingRoomCon}/completar-datos-cirugia`, data);
  return res.data;
};

export const changeOperatingRoomStatus = async (data: {
  id_CuentaEspacioHospitalario: string;
  estatus?: SurgeryStatus;
  horaAsignada?: string;
  id_UsuarioRecuperacion?: string;
}) => {
  const res = await axios.post(`${OperatingRoomCon}/estado-cirugia`, data);
  return res.data;
};

export const getOperatingRoomInformation = async (id: string): Promise<IOperatingRoomInformation> => {
  const res = await axios.get(`${OperatingRoomCon}/obtener-quirofano-paciente/${id}`);
  return res.data;
};
