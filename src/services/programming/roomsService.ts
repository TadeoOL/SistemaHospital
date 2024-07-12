import axios from '../../libs/axios';
import { IRoomEvent } from '../../types/types';
const apiRoom = '/api/Cuartos';

export const registerRoom = async (data: {
  nombre: string;
  descripcion: string;
  id_TipoCuarto: string;
  precio: number;
}) => {
  const res = await axios.post(`${apiRoom}/registrar-cuarto`, data);
  return res.data;
};

export const getRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiRoom}/paginacion-cuarto?${params}`);
  return res.data;
};

export const modifyRoom = async (data: {
  nombre: string;
  descripcion: string;
  id_TipoCuarto: string;
  id: string;
  precio: number;
}) => {
  const res = await axios.put(`${apiRoom}/editar-cuarto`, data);
  return res.data;
};

export const deleteRoom = async (roomId: string) => {
  const res = await axios.delete(`${apiRoom}/eliminar-cuarto`, { data: { id: roomId } });
  return res.data;
};

export const getAllRooms = async () => {
  const res = await axios.get(`${apiRoom}/lista-cuarto?`);
  return res.data;
};

export const getUnavailableRoomsByIdAndDate = async (roomId: string, date: Date) => {
  const res = await axios.get(`${apiRoom}/obtener-registros-cuarto-por-fecha`, {
    params: {
      id_Cuarto: roomId,
      fecha: date,
    },
  });
  return res.data;
};

export const getRoomsEventsByDate = async (date: string) => {
  const res = await axios.get(`${apiRoom}/obtener-todos-registros-cuarto-por-fecha`, {
    params: {
      fecha: date,
    },
  });
  return res.data as IRoomEvent[];
};

export const checkRoomAvailability = async (data: { id: string; fechaInicio: string; fechaFin: string }) => {
  const res = await axios.get(`${apiRoom}/verificar-disponibilidad-cuarto`, {
    params: data,
  });
  return res.data as IRoomEvent[];
};
