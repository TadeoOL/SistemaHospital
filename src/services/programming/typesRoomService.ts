import axios from '../../libs/axios';
const apiTypeRoom = '/api/Programacion/Catalogo/TipoCuarto';

export const getTypesRoomPagination = async (params: string) => {
  const res = await axios.get(`${apiTypeRoom}/paginacion-tipo-cuarto?${params}`);
  return res.data;
};

export const registerTypeRoom = async (data: {
  nombre: string;
  descripcion: string;
  intervaloReservacion?: string;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}) => {
  const res = await axios.post(`${apiTypeRoom}/registrar-tipo-cuarto`, data);
  console.log('res.data:', res.data);
  return res.data;
};

export const modifyTypeRoom = async (data: {
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
  const res = await axios.put(`${apiTypeRoom}/actualizar-tipo-cuarto`, data);
  return res.data;
};

export const deleteTypeRoom = async (typeRoomId: string) => {
  const res = await axios.delete(`${apiTypeRoom}/eliminar-tipo-cuarto`, { data: { id: typeRoomId } });
  return res.data;
};

export const getAllTypesRoom = async () => {
  //  const res = await axios.get(`${apiTypeRoom}/lista-tipo-cuarto`);
  const res = await axios.get(`${apiTypeRoom}/obtener-tipo-cuartos`);
  return res.data;
};
