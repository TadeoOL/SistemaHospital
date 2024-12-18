import { useMutation } from '@tanstack/react-query';
import { createAuthorization } from '../services/services.administration';

export const useCreateAdministrationAuthorization = () => {
  return useMutation({
    mutationFn: createAuthorization,
  });
};
