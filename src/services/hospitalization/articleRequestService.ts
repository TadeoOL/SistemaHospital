import { IRegisterArticleRequest } from '../../types/hospitalization/articleRequestTypes';
const apiUrl = '/api/Hospitalizacion/SolicitudArticulo';
import axios from '../../libs/axios';

export const createArticleRequest = async (data: IRegisterArticleRequest) => {
  const response = await axios.post(`${apiUrl}/registrar-solicitud-articulos`, data);
  return response.data;
};
