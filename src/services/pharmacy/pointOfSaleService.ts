import { CancelToken } from 'axios';
import axios from '../../libs/axios';
import { IRegisterSale, ISell, IUserSalesRegister } from '../../types/types';

const apiPos = '/api/PuntoVenta';

export const getSoldResume = async (checkoutId: string, sellStates: number[], cancelToken?: CancelToken) => {
  const estadosVenta = sellStates.join('&estadosVenta=');
  const res = await axios.get(`${apiPos}/obtener-resumen-venta/caja/${checkoutId}?estadosVenta=${estadosVenta}`, {
    cancelToken: cancelToken,
  });
  return res.data as ISell[];
};

export const getArticlesToSaleOnPOS = async (paramUrl: string) => {
  const res = await axios.get(`${apiPos}/obtener-articulos-venta?${paramUrl}`);
  return res.data;
};
//acomodar despues
export const getExistingArticlesPOS = async (paramUrl: string) => {
  const res = await axios.get(`/api/ArticuloExistente/paginacion-articulo-existente-pos?${paramUrl}`);
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

export const createUserSalesRegister = async () => {
  const res = await axios.post(`${apiPos}/registrar-caja`, {});
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

export const closeCheckout = async (checkoutData: {
  checkoutId: string;
  debit: number;
  credit: number;
  transfer: number;
  cash: number;
  totalAmount: number;
}) => {
  const { checkoutId, debit, credit, transfer, totalAmount, cash } = checkoutData;
  const res = await axios.put(`${apiPos}/cerrar-caja`, {
    id_Caja: checkoutId,
    debito: debit,
    credito: credit,
    transferencia: transfer,
    efectivo: cash,
    ventaTotal: totalAmount,
  });
  return res.data;
};

export const getAllSellsHistory = async (paramUrl: string, cancelToken?: CancelToken) => {
  const res = await axios.get(`${apiPos}/obtener-historial-total-ventas?${paramUrl}`, {
    cancelToken: cancelToken,
  });
  return res.data;
};

export const getCheckoutHistory = async (paramUrl: string, cancelToken?: CancelToken) => {
  const res = await axios.get(`${apiPos}/obtener-historial-corte-cajas?${paramUrl}`, {
    cancelToken: cancelToken,
  });
  return res.data;
};

export const getArticlesSold = async (id_VentaPrincipal: string) => {
  const res = await axios.get(`${apiPos}/obtener-articulos-vendidos`, {
    params: {
      id_VentaPrincipal,
    },
  });
  return res.data as {
    id_DetalleVenta: string;
    id_ArticuloExistente: string;
    nombre: string;
    cantidad: number;
    precioIVA: number;
    precioSubTotal: number;
    precioUnitario: number;
    precioTotal: number;
  }[];
};
