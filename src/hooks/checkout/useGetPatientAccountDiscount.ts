import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPatientBillById } from '../../services/checkout/patientAccount';
import { IDiscount } from '../../types/checkout/discountTypes';

export const useGetPatientAccountDiscount = (id_CuentaPaciente: string): UseQueryResult<IDiscount> => {
  return useQuery({
    queryKey: ['patient-account-discount', id_CuentaPaciente],
    queryFn: () => getPatientBillById(id_CuentaPaciente),
  });
};
