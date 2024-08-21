import { useQuery } from '@tanstack/react-query';
import { IAcountAllInformation } from '../../types/hospitalizationTypes';
import { getAccountFullInformation } from '../../services/programming/admissionRegisterService';

export const useGetAccountFullInformation = (patientId: string, patientAccountId: string) => {
  const paramURL = `Id_Paciente=${patientId}&Id_CuentaPaciente=${patientAccountId}`;
  const { data, isError, isLoading } = useQuery({
    queryKey: ['accountFullInformation', patientId],
    queryFn: async () => getAccountFullInformation(paramURL),
  });

  return {
    isLoading: isLoading,
    data: data as IAcountAllInformation,
    isError,
  };
};
