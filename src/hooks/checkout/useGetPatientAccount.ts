import { getPatientAccount } from '../../services/checkout/patientAccount';
import { useQuery } from '@tanstack/react-query';

export const useGetPatientAccount = (id: string) => {
  return useQuery({
    queryKey: ['patient-account', id],
    queryFn: () => getPatientAccount(id),
    enabled: !!id,
  });
};
