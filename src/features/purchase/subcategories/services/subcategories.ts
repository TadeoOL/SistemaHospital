import axios from '@/libs/axios';
import { ISubCategory } from '../interfaces/subcategories.interface';

export const getSubCategories = async (params: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/SubCategoria/paginacion-subcategoria`, { params });
  return res.data;
};

export const getSubCategoryById = async (subCategoryId: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/SubCategoria/${subCategoryId}`);
  return res.data;
};

export const disableSubCategory = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/SubCategoria/estatus-subcategoria`, { id });
  return res.data;
};

export const addNewSubCategory = async (data: ISubCategory) => {
  const { nombre, descripcion, id_categoria, iva } = data;
  const res = await axios.post(`/api/Compras/Catalogo/SubCategoria/registrar-subcategoria`, {
    nombre,
    descripcion,
    id_categoria,
    iva,
  });
  return res.data;
};

export const modifySubCategory = async (subCategory: ISubCategory) => {
  const { id, nombre, descripcion, id_categoria, iva } = subCategory;
  const res = await axios.put(`/api/Compras/Catalogo/SubCategoria/actualizar-subcategoria`, {
    id,
    nombre,
    descripcion,
    iva,
    id_categoria,
  });

  return res.data;
};
