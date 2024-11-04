import axios from '../../libs/axios';
const apiDailyOperatingRoom = '/api/Programacion/Catalogo/Quirofano';

export const getDailyOperatingRooms = async (params: string) => {
  const res = await axios.get(`/api/Quirofano/paginacion-programacion-quirofanos?${params}`);
  //const res = await axios.get(`${apiDailyOperatingRoom}/paginacion-Cirugias${params}`);
  return res.data;
};

export const getAllOperatingRooms = async () => {
  const res = await axios.get(`${apiDailyOperatingRoom}/obtener-quirofanos`);
  return res.data;
};


//quiza esta ya no se use
export const getSurgeriesHistory = async (params: string) => {
  const res = await axios.get(`${apiDailyOperatingRoom}/paginacion-historial-quirofano?${params}`);
  return res.data;
};

export const getOperatingRoomInfo = async (id: string) => {
  const res = await axios.get(`${apiDailyOperatingRoom}/obtener-informacion-quirofano`, {
    params: {
      Id_RegistroQuirofano: id,
    },
  });
  return res.data;
};
