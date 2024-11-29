import axios from '../../libs/axios';
import { IHospitalRoomInformationPagination } from '../../types/hospitalization/hospitalRoomTypes';
import { IPagination } from '../../types/paginationType';
const apiHospitalizationRooms = '/api/CuartoHospitalario';

export const getHospitalRoomsPagination = async (params: string): Promise<IPagination<IHospitalRoomInformationPagination>> => {
  const res = await axios.get(`${apiHospitalizationRooms}/paginacion-cuartos-hospitalarios?${params}`);
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

export const registerPatientDischarge = async (data: {
  Id_IngresoPaciente: string;
  DiagnosticoEgreso: string;
  MotivoEgreso: string;
}) => {
  const res = await axios.post(`${apiHospitalizationRooms}/registrar-alta-medica`, data);
  return res.data;
};
