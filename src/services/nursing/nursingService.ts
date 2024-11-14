import axios from '../../libs/axios';
import { IPagination } from '../../types/paginationType';
import { IAssignedRoomsPagination, ICreateKardexCommand, IPatientKardex } from '../../types/nursing/nursingTypes';
import { AddMedicationsFormData } from '../../components/Nursing/PatientKardex/AddMedicationsModal';
import { AddServicesFormData } from '../../components/Nursing/PatientKardex/AddServicesModal';

const apiUrl = '/api/Enfermeria';

export const getAssignedRoomsPagination = async (params: string): Promise<IPagination<IAssignedRoomsPagination>> => {
  const res = await axios.get(`${apiUrl}/paginacion-cuartos-asignados-enfermeria?${params}`);
  return res.data;
};

export const getPatientKardex = async (id: string): Promise<IPatientKardex[]> => {
  const res = await axios.get(`${apiUrl}/obtener-kardex-paciente`, {
    params: {
      id_IngresoPaciente: id,
    },
  });
  return res.data;
};

export const createPatientKardex = async (data: ICreateKardexCommand): Promise<ICreateKardexCommand> => {
  const res = await axios.post(`${apiUrl}/crear-kardex-paciente`, data);
  return res.data;
};

export const putMedications = async (kardexId: string, data: AddMedicationsFormData): Promise<IPatientKardex> => {
  const res = await axios.put(`${apiUrl}/agregar-medicamentos-kardex-paciente`, {
    id_Kardex: kardexId,
    medicamentos: data.medicamentos,
  });
  return res.data;
};

export const putServices = async (kardexId: string, data: AddServicesFormData): Promise<IPatientKardex> => {
  const res = await axios.put(`${apiUrl}/agregar-servicios-kardex-paciente`, {
    id_Kardex: kardexId,
    servicios: data.servicios,
  });
  return res.data;
};

