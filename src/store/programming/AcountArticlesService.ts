import axios from '../../libs/axios';
const apiRegister = '/api/ArticulosCuenta';

export const getArticlesFromAcountId= async (Id_CuentaPaciente: string) => {
  const res = await axios.get(`${apiRegister}/obtener-articulos-cuenta?Id_CuentaPaciente=${Id_CuentaPaciente}`);
  return res.data;
};

