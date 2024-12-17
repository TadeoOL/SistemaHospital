import axios from '@/libs/axios';
import { PaginatedResponse } from '@/types/tableComponentTypes';

export const getPaginacionRevolventes = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/paginacion-revolventes';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const createCajaRevolvente = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/crear-caja-revolvente';
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const asignarRevolventeCaja = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/asignar-revolvente-caja';
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const crearSalidaMonetaria = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/crear-salida-monetaria';
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const eliminarCajaRevolvente = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/eliminar-caja-revolvente';
  const res = await axios.delete(endpoint, data);
  return res.data;
};

export const getSaldoRevolvente = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/obtener-saldo-revolvente';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getPaginacionCajasRevolventes = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/paginacion-cajas-revolventes';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getPaginacionSalidasMonetarias = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/paginacion-salidas-monetarias';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const getPaginacionMovimientos = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Revolvente/paginacion-movimientos';
  const res = await axios.get(endpoint, { params });
  return res.data;
};
