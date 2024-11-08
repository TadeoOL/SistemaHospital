import axios from '../../libs/axios';
const apiService = '/api/Servicio/Catalogo/Servicio';
const apiRequestService = '/api/Hospitalizacion/SolicitudServicio';

export const createService = async (data: {
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: number;
  requiereAutorizacion: boolean;
  //codigoSAT?: string;
  //codigoUnidadMedida?: number;
}) => {
  const res = await axios.post(`${apiService}/registrar-Servicio`, data);
  return res.data;
};

export const addServiceRequestToPatient = async (data: {
  Id_CuentaPaciente: string;
  Id_Servicio: string;
}) => {
  const res = await axios.post(`${apiRequestService}/registrar-solicitud-servicio`, data);
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
  const res = await axios.put(`${apiService}/actualizar-Servicio`, data);
  return res.data;
};

export const disableXRay = async (data: any) => {
  const res = await axios.post(`${apiService}/deshabilitar-radiografia`, data);
  return res.data;
};

export const getServicesPagination = async (params: string) => {
  const res = await axios.get(`${apiService}/paginacion-Servicio?${params}`);
  return res.data;
};

export const getAllXRay = async () => {
  const res = await axios.get(`${apiService}/obtener-radiografias`);
  return res.data;
};

export const modifyXRayRequest = async (data: { Id_SolicitudRadiografia: string; Estatus: number }) => {
  const res = await axios.put(`${apiService}/modificar-radiografia-solicitud`, data);
  return res.data;
};

export const getXRayRequestPagination = async (params: string) => {
  const res = await axios.get(`${apiRequestService}/paginacion-solicitud-servicios?${params}`);
  return res.data;
};

export const addServiceRequest = async (data: {
  Id_Paciente: string;
  Id_CuentaPaciente: string;
  Id_Radiografia: string;
  CantidadHorasNeonatal?: string;
}) => {
  const res = await axios.post(`${apiRequestService}/crear-solicitud-radiografia`, data);
  return res.data;
};

//registrar-solicitud-servicio