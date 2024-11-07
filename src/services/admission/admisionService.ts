import axios from "../../libs/axios";
import { IRegisterPatientAdmissionCommand } from "../../types/operatingRoom/operatingRoomTypes";

const apiUrl = '/api/Admision';

export const registerPatientAdmission = async (data: IRegisterPatientAdmissionCommand) => {
  const res = await axios.post(`${apiUrl}/registrar-paciente`, data);
  return res.data;
};

export const getPatientAdmissionPagination = async (params: string) => {
  const res = await axios.get(`${apiUrl}/paginacion-pacientes?${params}`);
  return res.data;
};
