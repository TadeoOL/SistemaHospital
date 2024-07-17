import axios from '../../libs/axios';
import { IOperatingRoomConfig } from '../../types/operatingRoomTypes';
const apiOperatingRoomConfig = '/api/ConfiguracionQuirofano';

export const getOperatingRoomConfig = async () => {
  const res = await axios.get(`${apiOperatingRoomConfig}/obtener-configuracion-quirofano`);
  return res.data as IOperatingRoomConfig;
};
