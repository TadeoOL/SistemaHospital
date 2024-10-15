import axios from '../../libs/axios';
const api = '/api/Compras/Catalogo/SubCategoria';

export const getCategoriesForPOS = async ({
  warehouseId,
  categoryId,
}: {
  warehouseId?: string;
  categoryId?: string;
}) => {
  const res = await axios.get(`${api}/obtener-subcategorias`, {
    params: {
      id_Almacen: warehouseId,
      id_Categoria: categoryId,
    },
  });
  return res.data as any[];
};
