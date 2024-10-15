import axios from '../../libs/axios';

export const getPharmacyConfig = async () => {
  const res = await axios.get(`/api/Sistema/obtener-configuracion/Farmacia`);
  return res.data;
};
