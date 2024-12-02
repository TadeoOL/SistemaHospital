import { getDefaultPaginationParams, IPaginationParams, IPaginationResponse } from '@/types/paginationType';
import axios from '../../libs/axios';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';
const apiUrl = '/api/AutorizacionCompras';

export const getPurchaseAuthorizationPagination = async (
  paramUrl: IPaginationParams
): Promise<IPaginationResponse<IPurchaseOrderPagination>> => {
  const params = getDefaultPaginationParams(paramUrl);
  const res = await axios.get(`${apiUrl}/paginacion-autorizacion-orden-compra`, { params });
  return res.data;
};
