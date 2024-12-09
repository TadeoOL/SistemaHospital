import axios from '@/libs/axios';
import { IWarehouse } from '../interfaces/warehouses.interface';

export const getPurchaseWarehouse = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-almacen?${paramUrl}`);
  return res.data;
};

export const disableWarehouseById = async (id: string) => {
  const res = await axios.put(`/api/Almacen/estatus-almacen`, { id });
  return res.data;
};

export const getPurchaseWarehouseById = async (warehouseId: string) => {
  const res = await axios.get(`/api/Almacen/${warehouseId}`);
  return res.data;
};

export const modifyWarehouseById = async (warehouse: {
  Id_AlmacenPrincipal: string;
  Id_UsuarioEncargado?: string;
  descripcion: string;
  nombre: string;
}) => {
  const { Id_AlmacenPrincipal, Id_UsuarioEncargado, descripcion, nombre } = warehouse;
  const res = await axios.put(`/api/Almacen/actualizar-almacen`, {
    id: Id_AlmacenPrincipal,
    Id_UsuarioEncargado,
    descripcion,
    nombre,
  });
  return res.data;
};

export const addNewPurchaseWarehouse = async (data: IWarehouse) => {
  const { nombre, descripcion, id_UsuarioEncargado } = data;
  const res = await axios.post(`/api/Almacen/registrar-almacen`, {
    nombre,
    descripcion,
    id_UsuarioEncargado,
  });
  return res.data;
};
