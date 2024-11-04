import axios from '../../libs/axios';
const apiXRay = '/api/Servicio/Catalogo/Servicio';

export const createService = async (data: {
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: number;
  requiereAutorizacion: boolean;
  //codigoSAT?: string;
  //codigoUnidadMedida?: number;
}) => {
  const res = await axios.post(`${apiXRay}/registrar-Servicio`, data);
  return res.data;
};

export const addXRayRequest = async (data: {
  Id_Paciente: string;
  Id_CuentaPaciente: string;
  Id_Radiografia: string;
  CantidadHorasNeonatal?: string;
}) => {
  const res = await axios.post(`${apiXRay}/actualizar-Servicio`, data);
  return res.data;
};

export const modifyService = async (data: {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: number;
  requiereAutorizacion: boolean;
  //codigoSAT?: string;
  //codigoUnidadMedida?: number;
}) => {
  const res = await axios.put(`${apiXRay}/actualizar-Servicio`, data);
  return res.data;
};

export const disableXRay = async (data: any) => {
  const res = await axios.post(`${apiXRay}/deshabilitar-radiografia`, data);
  return res.data;
};

export const getServicesPagination = async (params: string) => {
  const res = await axios.get(`${apiXRay}/paginacion-Servicio?${params}`);
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
