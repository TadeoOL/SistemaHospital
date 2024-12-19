import { useMutation } from '@tanstack/react-query';
import { BankService } from '../services/services.bank';

export const useCreateApproveBankPurchase = () => {
  return useMutation({
    mutationFn: BankService.approveBankPurchase,
  });
};
