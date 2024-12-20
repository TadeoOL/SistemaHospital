import { useMutation } from '@tanstack/react-query';
import { AdministrationService } from '../services/services.administration';

export const useCreateAdministrationAuthorization = () => {
  return useMutation({
    mutationFn: AdministrationService.createAuthorization,
  });
};
