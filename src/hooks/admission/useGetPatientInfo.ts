import { useQuery } from '@tanstack/react-query';
import { getPatientInfo } from '../../services/admission/admisionService';
import { IAdmitPatientCommand } from '@/types/admission/admissionTypes';

export const useGetPatientInfo = (id_IngresoPaciente: string) => {
  return useQuery<IAdmitPatientCommand>({
    queryKey: ['patientInfo', id_IngresoPaciente],
    queryFn: () => getPatientInfo(id_IngresoPaciente),
  });
};
