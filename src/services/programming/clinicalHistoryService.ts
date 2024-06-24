import axios from '../../libs/axios';
import { HistorialClinico } from '../../types/admissionTypes';
const apiClinicalHistory = '/api/HistorialClinico';

interface ClinicalHistoryRegister {
  Id_Paciente: string;
  MotivoIngreso: string;
  DiagnosticoIngreso: string;
  Comentarios: string;
  Alergias: string;
  TipoSangre: string;
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

export const editClinicalHistory = async (data: {
  medicoTratante: string;
  especialidad: string;
  motivoIngreso: string;
  diagnosticoIngreso: string;
  procedimiento?: string;
  comentarios?: string;
  alergias?: string;
  tipoSangre?: string;
  id: string;
}) => {
  const res = await axios.put(`${apiClinicalHistory}/modificar-historial-clinico`, data);
  return res.data;
};
