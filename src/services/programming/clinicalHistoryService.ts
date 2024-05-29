import axios from '../../libs/axios';
import { HistorialClinico } from '../../types/admissionTypes';
const apiClinicalHistory = '/api/HistorialClinico';

interface ClinicalHistoryRegister {
  Id_Paciente: string;
  MedicoTratante: string;
  Especialidad: string;
  MotivoIngreso: string;
  DiagnosticoIngreso: string;
  Procedimiento: string;
  Comentarios: string;
}

export const createClinicalHistory = async (data: ClinicalHistoryRegister) => {
  const res = await axios.post(`${apiClinicalHistory}/registrar-historial-clinico`, data);
  return res.data;
};

export const getClinicalHistoryById = async (clinicalHistoryId: string) => {
  const res = await axios.get(`${apiClinicalHistory}/obtener-historial-clinico`, {
    params: {
      id_HistorialClinico: clinicalHistoryId,
    },
  });
  return res.data as HistorialClinico;
};
