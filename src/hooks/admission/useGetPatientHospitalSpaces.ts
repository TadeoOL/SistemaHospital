import { useQuery } from '@tanstack/react-query';
import { getPatientHospitalSpaces } from '../../services/admission/admisionService';
import { IPatientHospitalSpace } from '@/types/admission/admissionTypes';

export const useGetPatientHospitalSpaces = (patientAccountId: string) => {
  return useQuery<IPatientHospitalSpace[]>({
    queryKey: ['patientHospitalSpaces', patientAccountId],
    queryFn: () => getPatientHospitalSpaces(patientAccountId),
  });
};
