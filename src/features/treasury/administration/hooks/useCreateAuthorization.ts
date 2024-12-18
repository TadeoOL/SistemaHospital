import { useMutation } from '@tanstack/react-query';
import { AuthorizationSchema } from '../schema/schema.administration';

export const useCreateAdministrationAuthorization = () => {
  return useMutation({
    mutationFn: async (data: AuthorizationSchema) => {
      console.log(data);
    },
  });
};
