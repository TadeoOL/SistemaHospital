import axios from '@/libs/axios';

const apiRoom = '/api/Programacion/Catalogo/Cuarto';

export const getNormalRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiRoom}/paginacion-cuarto`, { params });
  return res.data;
};

export const registerNormalRoom = async (data: { nombre: string; descripcion: string; id_TipoCuarto: string }) => {
  const res = await axios.post(`${apiRoom}/registrar-cuarto`, data);
  return res.data;
};

export const modifyNormalRoom = async (data: {
  nombre: string;
  descripcion: string;
  id_TipoCuarto: string;
  id: string;
}) => {
  const res = await axios.put(`${apiRoom}/editar-cuarto`, data);
  return res.data;
};

export const deleteRoom = async (id: string) => {
  const res = await axios.put(`${apiRoom}/estatus-cuarto`, { id });
  return res.data;
};
