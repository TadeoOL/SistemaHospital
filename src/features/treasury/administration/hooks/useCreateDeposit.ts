import { useMutation } from '@tanstack/react-query';
import { approveDeposit } from '../services/services.administration';

export const useCreateDeposit = () => {
  return useMutation({
    mutationFn: approveDeposit,
  });
};
