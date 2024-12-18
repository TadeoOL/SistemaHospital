import { useMutation } from '@tanstack/react-query';

export const useCreateAuthorization = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      console.log(id);
    },
  });
};
