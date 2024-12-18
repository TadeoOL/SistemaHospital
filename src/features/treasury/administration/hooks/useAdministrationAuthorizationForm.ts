import { useForm } from 'react-hook-form';
import { authorizationSchema, AuthorizationSchema } from '../schema/schema.administration';
import { zodResolver } from '@hookform/resolvers/zod';

export const useAdministrationAuthorizationForm = (useCreateAuthorization: (data: AuthorizationSchema) => void) => {
  const methods = useForm<AuthorizationSchema>({
    resolver: zodResolver(authorizationSchema),
    values: {
      id_ConceptoSalida: '',
      cantidad: 0,
      motivo: '',
    },
  });

  const handleSubmit = (data: AuthorizationSchema) => {
    useCreateAuthorization(data);
  };

  return { methods, handleSubmit: methods.handleSubmit(handleSubmit) };
};
