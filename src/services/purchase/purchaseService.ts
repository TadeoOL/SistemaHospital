import axios from '../../libs/axios';
import { IPurchaseWithoutProvider } from '../../types/types';
const apiPurchase = '/api/Compras';

export const createPurchaseWithoutProvider = async (data: IPurchaseWithoutProvider) => {
  const res = await axios.post(`${apiPurchase}/crear-solicitud-compra`, data);
  return res.data;
};
