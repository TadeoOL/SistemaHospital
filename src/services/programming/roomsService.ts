import axios from '../../libs/axios';
import { IHospitalRoom } from '../../types/programming/hospitalRoomTypes';
import { IRoomEvent } from '../../types/types';
const apiRoom = '/api/Programacion/Catalogo/Cuarto';

export const registerRoom = async (data: { nombre: string; descripcion: string; id_TipoCuarto: string }) => {
  const res = await axios.post(`${apiRoom}/registrar-cuarto`, data);
  return res.data;
};

export const getRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiRoom}/paginacion-cuarto?${params}`);
  return res.data;
};

export const modifyRoom = async (data: { nombre: string; descripcion: string; id_TipoCuarto: string; id: string }) => {
  const res = await axios.put(`${apiRoom}/editar-cuarto`, data);
  return res.data;
};

export const deleteRoom = async (roomId: string) => {
  const res = await axios.delete(`${apiRoom}/eliminar-cuarto`, { data: { id: roomId } });
  return res.data;
};

export const getAllHospitalRooms = async (): Promise<IHospitalRoom[]> => {
  const res = await axios.get(`${apiRoom}/obtener-cuartos`);
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

export const getRoomsEventsByDate = async (endDate: string, initialDate: string, typeId?: string, roomId?: string) => {
  const res = await axios.get(`${apiRoom}/obtener-todos-registros-cuarto-por-fecha`, {
    params: {
      fechaInicial: initialDate,
      fechaFinal: endDate,
      id_TipoCuarto: typeId,
      id_Cuarto: roomId,
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

export const checkRoomAvailabilityToEdit = async (data: {
  id_RegistroCuarto: string;
  id_Cuarto: string;
  fechaInicio: string;
  fechaFin: string;
}) => {
  const res = await axios.get(`${apiRoom}/verificar-disponibilidad-cuarto-editar`, {
    params: data,
  });
  return res.data as IRoomEvent[];
};
