import axios from '../../libs/axios';
import { IRequestConfig } from '../../types/hospitalizationTypes';
const apiRequestsConfig = '/api/Sistema';

export const getRequestsConfig = async () => {
  const res = await axios.get(`${apiRequestsConfig}/obtener-configuracion/Servicios`);
  if(res.data.usuarios != null){
    return res.data.usuarios as IRequestConfig[];
  }
  return [];
};
