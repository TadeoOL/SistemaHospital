import { useQuery } from '@tanstack/react-query';
import { BankService } from '../services/services.bank';
import { IBankFound } from '../types/types.bank';

export const useGetBankFound = () => {
  return useQuery<IBankFound>({
    queryKey: ['bank-found'],
    queryFn: () => BankService.getBankFound(),
  });
};
