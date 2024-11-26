import { useQuery } from '@tanstack/react-query';
import { getPatientInfo } from '../../services/admission/admisionService';

export const useGetPatientInfo = (id_IngresoPaciente: string) => {
  return useQuery({
    queryKey: ['patientInfo', id_IngresoPaciente],
    queryFn: () => getPatientInfo(id_IngresoPaciente),
  });
};
