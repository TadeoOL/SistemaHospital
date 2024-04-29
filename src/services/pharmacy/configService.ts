import axios from '../../libs/axios';
const apiConfig = '/api/ConfiguracionFarmacia';

export const getPharmacyConfig = async () => {
  const res = await axios.get(`${apiConfig}/obtener-configuracion-farmacia`);
  return res.data;
};

export const createPharmacyConfig = async (data: { id_Almacen: string; factorVenta: string }) => {
  const res = await axios.post(`${apiConfig}/crear-configuracion-farmacia`, data);
  return res.data;
};
