import axios from '../../../../libs/axios';
import { GetParams } from '../../../../api/interface/params.interface';
import { IArticle } from '../../../../types/types';

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

export const modifyArticle = async (article: IArticle) => {
  const {
    id,
    nombre,
    descripcion,
    id_subcategoria,
    // stockAlerta,
    // stockMinimo,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    presentacion,
    factor,
  } = article;

  const res = await axios.put(`/api/Compras/Catalogo/Articulo/actualizar-articulo`, {
    id,
    nombre,
    descripcion,
    // stockAlerta,
    // stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    presentacion,
    factor,
  });
  return res.data;
};

export const addNewArticle = async (article: IArticle) => {
  const {
    nombre,
    descripcion,
    id_subcategoria,
    // stockAlerta,
    // stockMinimo,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    codigoUnidadMedida,
    presentacion,
    factor,
  } = article;

  const res = await axios.post(`/api/Compras/Catalogo/Articulo/registrar-articulo`, {
    nombre,
    descripcion,
    // stockAlerta,
    // stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    codigoUnidadMedida,
    presentacion,
    factor,
  });
  return res.data;
};

export const disableArticle = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/Articulo/estatus-articulo`, { id });
  return res.data;
};

export const getArticleById = async (articleId: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Articulo/${articleId}`);
  return res.data;
};
