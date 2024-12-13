import axios from '@/libs/axios';

export const createAuthorization = async (data: any) => {
  const endpoint = '/api/Tesoreria/Revolvente/asignar-revolvente-caja';
  const res = await axios.post(endpoint, data);
  return res;
};
