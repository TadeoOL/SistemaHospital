import axios from '../../libs/axios';
import { IPaginationResponse } from '../../types/paginationType';
//import { IWarehouseArticle } from '../../types/warehouse/article/warehouseArticle';
const API = '/api/AlmacenArticulo';
const API2 = '/api/Compras/Catalogo/Articulo';

export const getExistingArticles = async (
  paramUrl: string
): Promise<
  IPaginationResponse<{
    id: string;
    nombre: string;
    precio: number;
    precioVenta: number;
  }>
> => {
  const res = await axios.get(`${API2}/obtener-articulos?${paramUrl}`);
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
