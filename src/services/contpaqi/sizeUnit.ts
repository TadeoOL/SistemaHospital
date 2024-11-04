import axios from '../../libs/axiosContpaqi';
const apiContpaqiDocs = '/api/articulos';

export const getSizeUnit = async () => {
  const res = await axios.get(`${apiContpaqiDocs}/obtener-unidad-medida`);
  console.log("wuatefol",res);
  return res.data;
};
