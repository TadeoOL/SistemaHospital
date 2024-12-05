import { useMutation } from '@tanstack/react-query';
import { modifyModuleConfig } from '@/api/api.routes';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useApiConfigStore } from '@/store/apiConfig';

export const useAddApiKey = () => {
  const queryClient = useQueryClient();
  const setApiUrl = useApiConfigStore((state) => state.setApiUrl);

  return useMutation({
    mutationFn: (apiUrl: string) => {
      setApiUrl(apiUrl);
      return modifyModuleConfig({ apiUrl }, 'Facturacion');
    },
    onSuccess: () => {
      toast.success('API URL agregada con éxito!');
      queryClient.invalidateQueries({ queryKey: ['invoicing-api-key'] });
    },
    onError: (error) => {
      toast.error('Error al agregar la API URL!');
      console.log(error);
    },
  });
};
