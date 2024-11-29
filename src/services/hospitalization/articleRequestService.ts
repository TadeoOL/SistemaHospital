import { IRegisterArticleRequest, IReturnArticlesRequest } from '../../types/hospitalization/articleRequestTypes';
const apiUrl = '/api/Hospitalizacion/SolicitudArticulo';
import axios from '../../libs/axios';

export const createArticleRequest = async (data: IRegisterArticleRequest) => {
  const response = await axios.post(`${apiUrl}/registrar-solicitud-articulos`, data);
  return response.data;
};

export const createReturnArticlesRequest = async (data: IReturnArticlesRequest) => {
  const response = await axios.post(`${apiUrl}/registrar-solicitud-devolucion`, data);
  return response.data;
};