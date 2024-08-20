import axios from '../../libs/axios';
const apiXRay = '/api/Radiografia';

export const createXRay = async (data: { nombre: string; descripcion: string; precio: number; tipo: number }) => {
  const res = await axios.post(`${apiXRay}/crear-radiografia`, data);
  return res.data;
};

export const addXRayRequest = async (data: {
  Id_Paciente: string;
  Id_CuentaPaciente: string;
  Id_Radiografia: string;
  CantidadHorasNeonatal?: string;
}) => {
  const res = await axios.post(`${apiXRay}/crear-solicitud-radiografia`, data);
  return res.data;
};

export const modifyXRay = async (data: {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: number;
}) => {
  const res = await axios.put(`${apiXRay}/modificar-radiografia`, data);
  return res.data;
};

export const disableXRay = async (data: any) => {
  const res = await axios.post(`${apiXRay}/deshabilitar-radiografia`, data);
  return res.data;
};

export const getXRayPagination = async (params: string) => {
  const res = await axios.get(`${apiXRay}/paginacion-radiografia?${params}`);
  return res.data;
};

export const getXRayRequestPagination = async (params: string) => {
  const res = await axios.get(`${apiXRay}/paginacion-solicitud-radiografia?${params}`);
  return res.data;
};

export const getAllXRay = async () => {
  const res = await axios.get(`${apiXRay}/obtener-radiografias`);
  return res.data;
};

export const modifyXRayRequest = async (data: { Id_SolicitudRadiografia: string; Estatus: number }) => {
  const res = await axios.put(`${apiXRay}/modificar-radiografia-solicitud`, data);
  return res.data;
};
