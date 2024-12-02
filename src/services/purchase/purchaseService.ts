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
