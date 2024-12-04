import axios from '@/libs/axios';
import { getDefaultPaginationParams, IPaginationParams, IPaginationResponse } from '@/types/paginationType';
import { IPurchaseAuthorizationHistory } from '@/types/purchase/purchaseTypes';
const baseUrl = '/api/AutorizacionCompras';

export const getPurchaseAuthorizationHistory = async (
  paramUrl: IPaginationParams
): Promise<IPaginationResponse<IPurchaseAuthorizationHistory>> => {
  const params = getDefaultPaginationParams(paramUrl);
  const res = await axios.get(`${baseUrl}/paginacion-historial-autorizacion`, { params });
  return res.data;
};
