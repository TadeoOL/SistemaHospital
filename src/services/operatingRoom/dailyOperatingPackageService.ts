import axios from '../../libs/axios';
const apiDailyOperatingRoom = '/api/Quirofano/Catalogo/PaqueteQuirurgico';

export const getQurirgicalPackage = async (params: string) => {
  const res = await axios.get(`${apiDailyOperatingRoom}/obtener-paquetes-quirurgico?${params}`);
  return res.data;
};

export const getQurirgicalPackagePagination = async (params: string) => {
  const res = await axios.get(`${apiDailyOperatingRoom}/paginacion-paquete-quirurgico?${params}`);
  return res.data;
};

export const addArticlesPackage = async (packagePost: {
  Articulos: {id_Articulo: string, cantidad: number}[];
  Nombre: string;
  Descripcion: string;
}) => {
  const res = await axios.post(`${apiDailyOperatingRoom}/registrar-PaqueteQuirurgico`, {
    ...packagePost,
  });
  return res.data;
};
