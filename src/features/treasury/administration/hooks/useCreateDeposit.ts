import { useMutation } from '@tanstack/react-query';
import { AdministrationService } from '../services/services.administration';

export const useCreateDeposit = () => {
  return useMutation({
    mutationFn: AdministrationService.approveDeposit,
  });
};
