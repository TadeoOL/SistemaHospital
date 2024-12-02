import axios from '../../libs/axios';
import { IPaginationResponse } from '../../types/paginationType';
import { IAssignedRoomsPagination, ICreateKardexCommand, IPatientKardex } from '../../types/nursing/nursingTypes';
import { IPatientVitalSigns } from '../../types/nursing/patientVitalSignsTypes';
import { IPatientDiet } from '../../types/nursing/patientDietTypes';
import { VitalSignsFormData } from '../../schema/nursing/vitalSignsSchema';

const apiUrl = '/api/Enfermeria';

export const getAssignedRoomsPagination = async (
  params: string
): Promise<IPaginationResponse<IAssignedRoomsPagination>> => {
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

export const getPatientDiet = async (id: string): Promise<IPatientDiet[]> => {
  const res = await axios.get(`${apiUrl}/obtener-dietas-paciente`, {
    params: {
      id_IngresoPaciente: id,
    },
  });
  return res.data;
};

export const getVitalSigns = async (id: string): Promise<IPatientVitalSigns[]> => {
  const res = await axios.get(`${apiUrl}/obtener-signos-paciente`, {
    params: {
      id_IngresoPaciente: id,
    },
  });
  return res.data;
};

export const createPatientVitalSigns = async (data: VitalSignsFormData): Promise<IPatientVitalSigns> => {
  const res = await axios.post(`${apiUrl}/crear-signos-paciente`, data);
  return res.data;
};
