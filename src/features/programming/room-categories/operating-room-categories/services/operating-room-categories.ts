import axios from '@/libs/axios';
import { IRoomPriceRange } from '../interfaces/operating-room.interface';

const apiUrl = '/api/Programacion/Catalogo/TipoQuirofano';

export const getAllOperatingRoomCategories = async () => {
  const res = await axios.get(`${apiUrl}/obtener-tipo-quirofanos`);
  return res.data;
};

export const getOperatingRoomCategories = async () => {
  const res = await axios.get(`${apiUrl}/paginacion-tipo-quirofano`);
  return res.data;
};

interface ConfiguracionPrecio {
  hospitalizacion: IRoomPriceRange[];
  ambulatoria: IRoomPriceRange[];
}

export const registerOperatingRoomCategory = async (data: {
  nombre: string;
  descripcion: string;
  intervaloReservacion?: string;
  configuracionPrecio?: ConfiguracionPrecio;
  configuracionPrecioRecuperacion?: IRoomPriceRange[];
  precio?: number;
}) => {
  const res = await axios.post(`${apiUrl}/registrar-tipo-quirofano`, data);
  return res.data;
};

export const modifyOperatingRoomCategory = async (data: {
  nombre: string;
  descripcion: string;
  id: string;
  intervaloReservacion?: string;
  configuracionPrecio?: ConfiguracionPrecio;
  configuracionPrecioRecuperacion?: IRoomPriceRange[];
  precio?: number;
}) => {
  const res = await axios.put(`${apiUrl}/actualizar-tipo-quirofano`, data);
  return res.data;
};
