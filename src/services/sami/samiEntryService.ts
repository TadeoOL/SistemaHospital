import axios from '../../libs/axios';
const apiSamiEntry = '/api/AdmisionSami';

export const admitSamiPatientToHospital = async (id_Paciente: string) => {
  const res = await axios.put(`${apiSamiEntry}/pasar-admision-paciente-sami`, {
    id_Paciente,
  });
  return res.data;
};
