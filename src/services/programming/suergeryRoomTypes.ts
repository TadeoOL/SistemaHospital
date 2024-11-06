import axios from "../../libs/axios";

const apiUrl = '/api/Programacion/Catalogo/TipoQuirofano';

export const getAllSurgeryRoomTypes = async () => {
  const res = await axios.get(`${apiUrl}/obtener-tipo-quirofanos`);
  return res.data;
};

export const registerSurgeryRoomType = async (data: {
  nombre: string;
  descripcion: string;
  intervaloReservacion?: string;
  configuracionPrecio?: string;
  configuracionPrecioRecuperacion?: string;
  precio?: number;
}) => {
  const res = await axios.post(`${apiUrl}/registrar-tipo-quirofano`, data);
  return res.data;
};

export const modifySurgeryRoomType = async (data: {
  nombre: string;
  descripcion: string;
  id: string;
  intervaloReservacion?: string;
  configuracionPrecio?: string;
  configuracionPrecioRecuperacion?: string;
  precio?: number;
}) => {
  const res = await axios.put(`${apiUrl}/actualizar-tipo-quirofano`, data);
  return res.data;
};

