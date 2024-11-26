import { useQuery } from '@tanstack/react-query';
import { getPatientHospitalSpaces } from '../../services/admission/admisionService';

export const useGetPatientHospitalSpaces = (patientAccountId: string) => {
  return useQuery({
    queryKey: ['patientHospitalSpaces', patientAccountId],
    queryFn: () => getPatientHospitalSpaces(patientAccountId),
  });

};
