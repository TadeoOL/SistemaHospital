import axios from '@/libs/axios';
import { ICategory } from '@/types/types';
import { GetParams } from '@/api/interface/params.interface';

interface GetCategoriesParams extends GetParams {
  Id_Almacen?: string;
}

export const getCategories = async (params: GetCategoriesParams) => {
  const res = await axios.get(`/api/Compras/Catalogo/Categoria/paginacion-categoria`, { params });
  return res.data;
};

export const addNewCategory = async (data: ICategory) => {
  const { nombre, descripcion, id_Almacen } = data;
  const res = await axios.post(`/api/Compras/Catalogo/Categoria/registrar-categoria`, {
    Nombre: nombre,
    Descripcion: descripcion,
    id_Almacen: id_Almacen,
  });
  return res.data;
};

export const modifyCategory = async (category: ICategory) => {
  const { id_Categoria, nombre, descripcion, id_Almacen } = category;

  const res = await axios.put(`/api/Compras/Catalogo/Categoria/actualizar-categoria`, {
    id: id_Categoria,
    Nombre: nombre,
    Descripcion: descripcion,
    id_Almacen: id_Almacen,
  });
  return res.data;
};

export const disableCategory = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/Categoria/estatus-categoria`, { id });
  return res.data;
};
