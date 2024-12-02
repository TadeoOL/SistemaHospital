import { getDefaultPaginationParams, IPaginationResponse, IPaginationParams } from '@/types/paginationType';
import axios from '../../libs/axios';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';
const apiPurchase = '/api/Compras';

export const deleteBillQuote = async (idQuote: string) => {
  const res = await axios.delete(`${apiPurchase}/eliminar-factura-orden-compra/${idQuote}`);
  return res.data;
};

export const getPurchaseOrder = async (
  paramUrl?: IPaginationParams & { estatus?: number; fueAutorizada?: boolean | string }
): Promise<IPaginationResponse<IPurchaseOrderPagination>> => {
  const params = getDefaultPaginationParams(paramUrl);
  const res = await axios.get(`${apiPurchase}/paginacion-orden-compra`, { params });
  return res.data;
};

export const getOrderRequestById = async (idQuote: string) => {
  const res = await axios.get(`${apiPurchase}/obtener-orden-compra/${idQuote}`);
  return res.data;
};

export const changeOrderStatus = async (Id_OrdenCompra: string, Estatus: number, Mensaje?: string) => {
  try {
    const res = await axios.put(`${apiPurchase}/estatus-orden-compra`, {
      Id_OrdenCompra,
      Estatus,
      Mensaje,
    });
    return res.data;
  } catch (error) {
    console.error('Error al cambiar estado de la orden:', error);
    throw error;
  }
};

export const getPurchaseOrderQuotationById = async (idQuote: string): Promise<string> => {
  const res = await axios.get(`${apiPurchase}/obtener-cotizacion-orden-compra/${idQuote}`);
  return res.data;
};
