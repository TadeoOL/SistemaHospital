import axios from '../libs/axios';
import { GetParams } from './interface/params.interface';

interface GetArticlesParams extends GetParams {
  id_AlmacenPrincipal?: string;
  id_Almacen?: string;
  Id_Subcategoria?: string;
}

export const getArticles = async (params: GetArticlesParams) => {
  const res = await axios.get(`/api/Compras/Catalogo/Articulo/paginacion-articulo`, {
    params,
  });
  return res.data;
};
