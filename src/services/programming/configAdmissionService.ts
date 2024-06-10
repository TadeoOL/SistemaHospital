import axios from '../../libs/axios';
const apiConfigAdmission = '/api/ConfiguracionAdmision';

export const getAdmissionConfig = async () => {
  const res = await axios.get(`${apiConfigAdmission}/obtener-configuracion-admision`);
  return res.data;
};
