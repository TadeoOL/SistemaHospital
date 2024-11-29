import { ISurgeryRoomDetails } from '@/types/programming/surgeryRoomTypes';
import axios from '../../libs/axios';
import {
  IAdmissionDocInfo,
  IAdmitPatientCommand,
  IHospitalSpaceRecordDto,
  IPatientHospitalSpace,
  IPatientReentryInfo,
  IRegisterPatientAdmissionCommand,
  IRegisterPatientReentryCommand,
} from '../../types/admission/admissionTypes';

const apiUrl = '/api/Admision';

export const registerPatientAdmission = async (data: IRegisterPatientAdmissionCommand) => {
  const res = await axios.post(`${apiUrl}/registrar-paciente`, data);
  return res.data;
};

export const getPatientAdmissionPagination = async (params: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-pacientes?${params}`);
  return res.data;
};

export const admitPatient = async (data: IAdmitPatientCommand) => {
  const res = await axios.put(`${apiUrl}/admitir-paciente`, data);
  return res.data;
};

export const getPatientInfo = async (id_IngresoPaciente: string): Promise<IAdmitPatientCommand> => {
  const res = await axios.get(`${apiUrl}/obtener-informacion-paciente/${id_IngresoPaciente}`);
  return res.data;
};

export const getPatientHospitalSpaces = async (id_CuentaPaciente: string): Promise<IPatientHospitalSpace[]> => {
  const res = await axios.get(`${apiUrl}/obtener-espacios-hospitalarios-paciente/${id_CuentaPaciente}`);
  return res.data;
};

export const addHospitalizationSpace = async (data: {
  espacioHospitalario: IHospitalSpaceRecordDto & { tipoEspacioHospitalario: number };
  id_CuentaPaciente: string;
}) => {
  const res = await axios.put(`${apiUrl}/agregar-espacio-hospitalario`, data);
  return res.data;
};

export const modifyRoomsEvents = async (data: {
  id_CuentaPaciente: string;
  listaRegistros: {
    id_EspacioHospitalario: string;
    fechaInicio: Date;
    fechaFin: Date;
    id_Espacio: string;
    TipoEspacioHospitalario: number;
    id_PaqueteQuirurgico?: string;
    id_Medico?: string;
  }[];
}) => {
  const res = await axios.put(`${apiUrl}/modificar-lista-registros-espacios-hospitalarios`, data);
  return res.data;
};

export const editProcedures = async (data: { id_CuentaPaciente: string; id_Cirugias: string[] }) => {
  const res = await axios.put(`${apiUrl}/modificar-lista-procedimientos`, data);
  return res.data;
};

export const modifyPatientMedic = async (data: { id_Medico: string; id_CuentaPaciente: string }) => {
  const res = await axios.put(`${apiUrl}/modificar-medico-paciente`, data);
  return res.data;
};

export const getAdmissionDoc = async (id_IngresoPaciente: string): Promise<IAdmissionDocInfo> => {
  const res = await axios.get(`${apiUrl}/obtener-informacion-documentos-paciente/${id_IngresoPaciente}`);
  return res.data;
};

export const getPatientReentryInfo = async (id_CuentaPaciente: string): Promise<IPatientReentryInfo> => {
  const res = await axios.get(`${apiUrl}/obtener-informacion-reingreso-paciente/${id_CuentaPaciente}`);
  return res.data;
};

export const createPatientReentry = async (data: IRegisterPatientReentryCommand): Promise<void> => {
  const res = await axios.post(`${apiUrl}/crear-reingreso-paciente`, data);
  return res.data;
};

export const getSurgeryRoomDetails = async (id: string): Promise<ISurgeryRoomDetails> => {
  const res = await axios.get(`${apiUrl}/obtener-detalles-quirofano-paciente/${id}`);
  return res.data;
};
