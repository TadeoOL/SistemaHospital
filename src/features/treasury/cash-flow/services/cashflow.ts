import axios from '@/libs/axios';
import { getDefaultPaginationParams, IPaginationParams } from '@/types/paginationType';
import { PaginatedResponse } from '@/types/tableComponentTypes';
const baseUrl = '/api/Tesoreria/Revolvente';

export const getPaginacionRevolventes = async (paramsUrl?: IPaginationParams): Promise<PaginatedResponse> => {
  const params = getDefaultPaginationParams(paramsUrl);
  const endpoint = `${baseUrl}/paginacion-revolventes`;
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const createCajaRevolvente = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = `${baseUrl}/crear-caja-revolvente`;
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const asignarRevolventeCaja = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = `${baseUrl}/asignar-revolvente-caja`;
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const crearSalidaMonetaria = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = `${baseUrl}/crear-salida-monetaria`;
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const eliminarCajaRevolvente = async (id: string): Promise<void> => {
  const endpoint = `${baseUrl}/eliminar-caja-revolvente/${id}`;
  const res = await axios.delete(endpoint);
  return res.data;
};

export const getSaldoRevolvente = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = `${baseUrl}/obtener-saldo-revolvente`;
  const res = await axios.get(endpoint, { params });
  console.log('res:', res);
  return res.data;
};

export const getPaginacionCajasRevolventes = async (paramsUrl?: IPaginationParams): Promise<PaginatedResponse> => {
  const params = getDefaultPaginationParams(paramsUrl);
  const endpoint = `${baseUrl}/paginacion-cajas-revolventes`;
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getPaginacionSalidasMonetarias = async (paramsUrl?: IPaginationParams): Promise<PaginatedResponse> => {
  const params = getDefaultPaginationParams(paramsUrl);
  const endpoint = `${baseUrl}/paginacion-salidas-monetarias`;
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getPaginacionMovimientos = async (paramsUrl?: IPaginationParams): Promise<PaginatedResponse> => {
  const params = getDefaultPaginationParams(paramsUrl);
  const endpoint = `${baseUrl}/paginacion-movimientos`;
  const res = await axios.get(endpoint, { params });
  return res.data;
};
