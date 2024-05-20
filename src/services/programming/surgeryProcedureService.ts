import axios from '../../libs/axios';
const apiSurgeryProcedure = '/api/ProcedimientoCirujia';

export const registerSurgeryProcedure = async (data: {
  nombre: string;
  descripcion: string;
  duracionHospitalizacion: string;
  duracionCirujia: string;
}) => {
  const res = await axios.post(`${apiSurgeryProcedure}/registrar-procedimiento-cirujia`, data);
  return res.data;
};

export const getSurgeryProceduresPagination = async (params: string) => {
  const res = await axios.get(`${apiSurgeryProcedure}/paginacion-procedimiento-cirujia?${params}`);
  return res.data;
};

export const modifySurgeryProcedure = async (data: {
  nombre: string;
  descripcion: string;
  duracionHospitalizacion: string;
  duracionCirujia: string;
  id: string;
}) => {
  const res = await axios.put(`${apiSurgeryProcedure}/editar-procedimiento-cirujia`, data);
  return res.data;
};

export const deleteSurgeryProcedure = async (roomId: string) => {
  const res = await axios.delete(`${apiSurgeryProcedure}/eliminar-procedimiento-cirujia`, { data: { id: roomId } });
  return res.data;
};
