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
