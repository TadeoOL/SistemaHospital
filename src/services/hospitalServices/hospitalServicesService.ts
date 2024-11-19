import axios from "../../libs/axios";
import { IHospitalService } from "../../types/hospitalServices/hospitalServiceTypes";

const apiUrl = '/api/Servicio/Catalogo/Servicio';
const apiRequestService = '/api/Hospitalizacion/SolicitudServicio';

export const getHospitalServicesPagination = async (paramUrl: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-servicio?&${paramUrl}`);
  return res.data;
};

export const getHospitalServices = async ({ serviceType = 0 }: { serviceType: number }): Promise<IHospitalService[]> => {
  const res = await axios.get(`${apiUrl}/obtener-servicios`,{
    params: {
      tipoServicio: serviceType,
    },
  });
  return res.data;
};
    

export const createHospitalService = async (data: {
    nombre: string;
    descripcion: string;
    precio: number;
    tipoServicio: number;
    requiereAutorizacion: boolean;
    //codigoSAT?: string;
    //codigoUnidadMedida?: number;
  }) => {
    const res = await axios.post(`${apiUrl}/registrar-Servicio`, data);
    return res.data;
  };

  export const modifyHospitalService = async (data: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    tipoServicio: number;
    requiereAutorizacion: boolean;
    //codigoSAT?: string;
    //codigoUnidadMedida?: number;
  }) => {
    const res = await axios.put(`${apiUrl}/actualizar-Servicio`, data);
    return res.data;
  };

  export const addHospitalServiceRequest = async (data: {
    Id_Paciente: string;
    Id_CuentaPaciente: string;
    Id_Servicio: string;
    CantidadHorasNeonatal?: string;
  }) => {
    const res = await axios.post(`${apiUrl}/registrar-solicitud-radiografia`, data);
    return res.data;
  };

  export const disableHospitalService = async (id: string) => {
    const res = await axios.post(`${apiUrl}/deshabilitar-servicio`, { Id_Servicio: id });
    return res.data;
  };

  export const getServicesRequestPagination = async (params: string) => {
    const res = await axios.get(`${apiRequestService}/paginacion-solicitud-servicios?${params}`);
    return res.data;
  };

  export const modifyServiceRequest = async (data: { Id_CuentaServicio: string; Estatus: number }) => {
    const res = await axios.put(`${apiRequestService}/estatus-solicitud-servicio`, data);
    return res.data;
  };

  export const addHospitalServicesRequest = async (data: { Id_CuentaPaciente: string; Id_Servicios: string[] }) => {
    const res = await axios.post(`${apiRequestService}/registrar-solicitud-servicios`, data);
    return res.data;
  };
  