import { getPatientAccount } from '@/services/checkout/patientAccount';
import { IPatientAccount } from '@/types/checkout/patientAccountTypes';
import { useQuery } from '@tanstack/react-query';

export const useGetPatientAccount = (id: string) => {
  return useQuery<IPatientAccount>({
    queryKey: ['patient-account', id],
    queryFn: () => getPatientAccount(id),
  });
};
