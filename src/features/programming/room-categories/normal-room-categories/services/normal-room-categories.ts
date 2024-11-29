import axios from '@/libs/axios';

const apiNormalRoomCategory = '/api/Programacion/Catalogo/TipoCuarto';

export const getNormalRoomCategories = async (params: any) => {
  const res = await axios.get(`${apiNormalRoomCategory}/paginacion-tipo-cuarto`, { params });
  return res.data;
};

export const registerNormalRoomCategory = async (data: {
  nombre: string;
  descripcion: string;
  intervaloReservacion?: string;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}) => {
  const res = await axios.post(`${apiNormalRoomCategory}/registrar-tipo-cuarto`, data);
  return res.data;
};

export const modifyNormalRoomCategory = async (data: {
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
  const res = await axios.put(`${apiNormalRoomCategory}/actualizar-tipo-cuarto`, data);
  return res.data;
};

export const deleteNormalRoomCategory = async (RoomCategoryId: string) => {
  const res = await axios.delete(`${apiNormalRoomCategory}/eliminar-tipo-cuarto`, { data: { id: RoomCategoryId } });
  return res.data;
};

export const getAllTypesNormalRoom = async () => {
  //  const res = await axios.get(`${apiRoomCategory}/lista-tipo-cuarto`);
  const res = await axios.get(`${apiNormalRoomCategory}/obtener-tipo-cuartos`);
  return res.data;
};
