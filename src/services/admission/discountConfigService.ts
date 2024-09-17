import axios from '../../libs/axios';
const apiDiscountConfig = '/api/ConfiguracionDescuentos';

export const getDiscountConfig = async () => {
  const res = await axios.get(`${apiDiscountConfig}/obtener-configuracion-descuentos`);
  return res.data as { id: string; nombre: string }[];
};
