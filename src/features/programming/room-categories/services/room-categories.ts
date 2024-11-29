import axios from '@/libs/axios';

const apiRoomCategory = '/api/Programacion/Catalogo/TipoCuarto';

export const getRoomCategories = async (params: any) => {
  const res = await axios.get(`${apiRoomCategory}/paginacion-tipo-cuarto`, { params });
  return res.data;
};

export const registerRoomCategory = async (data: {
  nombre: string;
  descripcion: string;
  intervaloReservacion?: string;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}) => {
  const res = await axios.post(`${apiRoomCategory}/registrar-tipo-cuarto`, data);
  return res.data;
};

export const modifyRoomCategory = async (data: {
  nombre: string;
  descripcion: string;
  id: string;
  intervaloReservacion?: string;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}) => {
  const res = await axios.put(`${apiRoomCategory}/actualizar-tipo-cuarto`, data);
  return res.data;
};

export const deleteRoomCategory = async (RoomCategoryId: string) => {
  const res = await axios.delete(`${apiRoomCategory}/eliminar-tipo-cuarto`, { data: { id: RoomCategoryId } });
  return res.data;
};

export const getAllTypesRoom = async () => {
  //  const res = await axios.get(`${apiRoomCategory}/lista-tipo-cuarto`);
  const res = await axios.get(`${apiRoomCategory}/obtener-tipo-cuartos`);
  return res.data;
};
