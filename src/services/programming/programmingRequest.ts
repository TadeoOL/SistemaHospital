import axios from '../../libs/axios';
const apuProgrammingRequest = '/api/SolicitudProcedimiento';

export const createProgrammingRequest = async (data: {
  id_Paciente: string;
  id_Medico: string;
  procedimientos: string;
  fechaSugerida: Date;
  recomendacionMedica: boolean;
  notas?: string;
}) => {
  const res = await axios.post(`${apuProgrammingRequest}/registrar-solicitud-procedimiento`, data);
  return res.data;
};

export const getProgrammingRequestsPagination = async (params: string) => {
  const res = await axios.get(`${apuProgrammingRequest}/paginacion-solicitud-procedimiento?${params}`);
  return res.data;
};
