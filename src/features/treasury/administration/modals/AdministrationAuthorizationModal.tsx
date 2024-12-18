import { ModalBasic } from '@/common/components';
import { AuthorizationForm } from '../components/AuthorizationForm';
import { useAdministrationAuthorizationForm } from '../hooks/useAdministrationAuthorizationForm';
import { FormProvider } from 'react-hook-form';
import AuthorizationModalActions from '../components/AuthorizationModalActions';
import { useEffect } from 'react';
interface Props {
  open: boolean;
  onClose: () => void;
  useAuthorizationForm: ReturnType<typeof useAdministrationAuthorizationForm>;
}
export const AdministrationAuthorizationModal = ({ open, onClose, useAuthorizationForm }: Props) => {
  const { methods, handleSubmit } = useAuthorizationForm;

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        methods.reset();
      }, 250);
    }
  }, [open]);

  return (
    <FormProvider {...methods}>
      <ModalBasic
        open={open}
        header="Crear autorización"
        onClose={onClose}
        actions={<AuthorizationModalActions key="actions" onCancel={onClose} onSubmit={handleSubmit} />}
      >
        <AuthorizationForm />
      </ModalBasic>
    </FormProvider>
  );
};
