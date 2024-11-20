const apiUrl = '/api/Sistema';
import axios from '../../libs/axios';
import { IConfigEmitterUsers, IDiscountConfig } from '../../types/checkout/checkoutConfigTypes';

export const getEmitterUsersConfig = async (): Promise<IConfigEmitterUsers[]> => {
  const res = await axios.get(`${apiUrl}/obtener-configuracion/PaseCaja`);
  return res.data
};

export const getDiscountConfig = async (): Promise<IDiscountConfig[]> => {
  const res = await axios.get(`${apiUrl}/obtener-configuracion/Descuentos`);
  return res.data;
};
