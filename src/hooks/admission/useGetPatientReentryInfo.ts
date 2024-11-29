import { useQuery } from '@tanstack/react-query';
import { getPatientReentryInfo } from '../../services/admission/admisionService';
import { IPatientReentryInfo } from '@/types/admission/admissionTypes';

export const useGetPatientReentryInfo = (id_CuentaPaciente: string) => {
  return useQuery<IPatientReentryInfo>({
    queryKey: ['patient-reentry-info', id_CuentaPaciente],
    queryFn: () => getPatientReentryInfo(id_CuentaPaciente),
  });
};
