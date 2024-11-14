import axios from '../../libs/axios';
import { IHospitalRoomInformation, IHospitalRoomInformationPagination } from '../../types/hospitalization/hospitalRoomTypes';
import { IPagination } from '../../types/paginationType';
const apiHospitalizationRooms = '/api/CuartoHospitalario';

export const getHospitalRoomsPagination = async (params: string): Promise<IPagination<IHospitalRoomInformationPagination>> => {
  const res = await axios.get(`${apiHospitalizationRooms}/paginacion-cuartos-hospitalarios?${params}`);
  return res.data;
};

export const getHospitalRoomInformation = async (id: string): Promise<IHospitalRoomInformation> => {
  const res = await axios.get(`${apiHospitalizationRooms}/cuarto-hospitalario/${id}`);
  return res.data;
};


export const getHospitalRoomsCalendar = async (date: Date) => {
  const res = await axios.get(`${apiHospitalizationRooms}/cuartos-hospitalizacion-calendario`, {
    params: {
      fecha: date,
    },
  });
  return res.data;
};

export const updateHospitalRoomExitDate = async (id: string, date: Date) => {
  const res = await axios.put(`${apiHospitalizationRooms}/actualizar-fecha-salida-cuarto-hospitalario`, {
    id_CuentaEspacioHospitalario: id,
    fechaSalida: date,
  });
  return res.data;
};

