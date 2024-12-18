import { useForm } from 'react-hook-form';
import { authorizationSchema, AuthorizationSchema } from '../schema/schema.administration';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAdministrationAuthorization } from './useCreateAuthorization';

export const useAdministrationAuthorizationForm = (onClose: () => void) => {
  const { mutate: createAuthorization } = useCreateAdministrationAuthorization();
  const methods = useForm<AuthorizationSchema>({
    resolver: zodResolver(authorizationSchema),
    values: {
      id_ConceptoSalida: '',
      cantidad: 0,
      motivo: '',
    },
  });

  const handleSubmit = (data: AuthorizationSchema) => {
    createAuthorization(data);
    onClose();
  };

  return { methods, handleSubmit: methods.handleSubmit(handleSubmit) };
};
