import axios from '../../libs/axios';
const apiConfig = '/api/ConfiguracionFarmacia';

export const getPharmacyConfig = async () => {
  const res = await axios.get(`${apiConfig}/obtener-configuracion-farmacia`);
  return res.data;
};
