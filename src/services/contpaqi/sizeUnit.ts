import axios from '../../libs/axiosContpaqi';
const apiContpaqiDocs = '/api/productos';

export const getSizeUnit = async () => {
  const res = await axios.get(`${apiContpaqiDocs}/obtener-unidad-medida`);
  return res.data;
};
