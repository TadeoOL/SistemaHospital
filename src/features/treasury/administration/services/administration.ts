import axios from '@/libs/axios';
import { PaginatedResponse } from '@/types/tableComponentTypes';

export const getPaginacionDepositosPendientes = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Direccion/paginacion-depositos-pendientes';
  const res = await axios.get(endpoint, { params });
  return res.data;
};

export const crearDeposito = async (data: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Direccion/crear-deposito';
  const res = await axios.post(endpoint, data);
  return res.data;
};

export const getMovimientosDireccion = async (params?: any): Promise<PaginatedResponse> => {
  const endpoint = '/api/Tesoreria/Direccion/movimientos-direccion';
  const res = await axios.get(endpoint, { params });
  return res.data;
};
