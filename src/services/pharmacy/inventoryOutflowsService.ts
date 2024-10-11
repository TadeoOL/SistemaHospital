import axios from '../../libs/axios';
const API = '/api/SalidasExistencias';

export const getWaitingPackagesByWarehouse = async (paramUrl: string) => {
  const res = await axios.get(`${API}/paginacion-paquetes-espera?${paramUrl}`);
  return res.data;
};

export const getNurseRequestPending = async (paramUrl: string) => {
  const res = await axios.get(`${API}/paginacion-solicitud-enfermero?${paramUrl}`);
  return res.data;
};
