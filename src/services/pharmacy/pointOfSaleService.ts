import { CancelToken } from 'axios';
import axios from '../../libs/axios';
import { IRegisterSale, ISell, IUserSalesRegister } from '../../types/types';

const apiPos = '/api/PuntoVenta';

export const getSoldResume = async (checkoutId: string, sellStates: number[]) => {
  const estadosVenta = sellStates.join('&estadosVenta=');
  const res = await axios.get(`${apiPos}/obtener-resumen-venta/caja/${checkoutId}?estadosVenta=${estadosVenta}`);
  return res.data as ISell[];
};

export const getArticlesToSaleOnPOS = async (paramUrl: string) => {
  const res = await axios.get(`${apiPos}/obtener-articulos-venta?${paramUrl}`);
  return res.data;
};

export const getCategoriesForPOS = async (warehouseId: string) => {
  const res = await axios.get(`${apiPos}/obtener-subCategorias-puntoVenta/almacen/${warehouseId}`);
  return res.data as any[];
};

export const registerSale = async (data: IRegisterSale) => {
  const res = await axios.post(`${apiPos}/registrar-venta`, data);
  return res.data;
};

export const getUserSalesRegister = async (userId: string) => {
  const res = await axios.get(`${apiPos}/obtener-caja/usuario/${userId}`);
  return res.data as IUserSalesRegister;
};

export const createUserSalesRegister = async (userId: string) => {
  const res = await axios.post(`${apiPos}/registrar-caja`, {
    Id_Usuario: userId,
  });
  return res.data;
};

export const changeSellStatus = async (checkoutId: string, status: number) => {
  const res = await axios.post(`${apiPos}/cambiar-estado-venta`, {
    id: checkoutId,
    estadoVenta: status,
  });
  return res.data;
};

export const getSellsHistory = async (paramUrl: string, cancelToken?: CancelToken) => {
  const res = await axios.get(`${apiPos}/obtener-historial-ventas?${paramUrl}`, {
    cancelToken: cancelToken,
  });
  return res.data;
};
