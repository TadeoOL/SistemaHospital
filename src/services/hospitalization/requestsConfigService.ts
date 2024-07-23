import axios from '../../libs/axios';
import { IRequestConfig } from '../../types/hospitalizationTypes';
const apiRequestsConfig = '/api/ConfiguracionSolicitudes';

export const getRequestsConfig = async () => {
  const res = await axios.get(`${apiRequestsConfig}/obtener-configuracion-solicitudes`);
  return res.data as IRequestConfig[];
};
