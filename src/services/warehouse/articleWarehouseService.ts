import axios from '../../libs/axios';
const API = '/api/AlmacenArticulo';

export const getExistingArticles = async (paramUrl: string) => {
  const res = await axios.get(`${API}/paginacion-almacen-articulo?${paramUrl}`);
  return res.data;
};

export const articlesOutputToWarehouseToWarehouse = async (data: {
  id_Almacen: string;
  articulos: {
    Id_Articulo: string;
    Id_ArticuloAlmacenStock: string;
    Nombre: string;
    Cantidad: number;
  }[];
  motivo?: string;
}) => {
  const res = await axios.post(`${API}/salida-almacen-articulo`, {
    ...data,
  });
  return res.data;
};
