import axios from '../../libs/axios';
const apiDailyOperatingRoom = '/api/QuirofanoDelDia';

export const getDailyOperatingRooms = async (params: string) => {
  const res = await axios.get(`${apiDailyOperatingRoom}/paginacion-quirofanos-del-dia?${params}`);
  return res.data;
};

export const getAllOperatingRooms = async () => {
  const res = await axios.get(`${apiDailyOperatingRoom}/lista-quirofanos`);
  return res.data;
};

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
