import axios from '../../libs/axios';
const apiRoom = '/api/Cuartos';

export const registerRoom = async (data: { nombre: string; descripcion: string; tipoCuarto: string }) => {
  const res = await axios.post(`${apiRoom}/registrar-cuarto`, data);
  return res.data;
};

export const getRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiRoom}/paginacion-cuarto?${params}`);
  return res.data;
};

export const modifyRoom = async (data: { nombre: string; descripcion: string; tipoCuarto: string; id: string }) => {
  const res = await axios.put(`${apiRoom}/editar-cuarto`, data);
  return res.data;
};

export const deleteRoom = async (roomId: string) => {
  const res = await axios.delete(`${apiRoom}/eliminar-cuarto`, { data: { id: roomId } });
  return res.data;
};
