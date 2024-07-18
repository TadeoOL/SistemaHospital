import axios from '../../libs/axios';
const apiHospitalizationRooms = '/api/CuartosHospitalizacion';

export const getHospitalRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiHospitalizationRooms}/paginacion-cuartos-hospitalizacion?${params}`);
  return res.data;
};

export const getHospitalizationRoomInfo = async (id: string) => {
  const res = await axios.get(`${apiHospitalizationRooms}/informacion-cuarto-hospitalizacion?`, {
    params: {
      id_RegistroCuarto: id,
    },
  });
  return res.data;
};

export const getAssignedRoomsPagination = async (params: string) => {
  const res = await axios.get(`${apiHospitalizationRooms}/paginacion-cuartos-asignados-hospitalizacion?${params}`);
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
