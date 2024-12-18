import { ModalBasic } from '@/common/components';
import { AuthorizationForm } from '../components/AuthorizationForm';
import { useAdministrationAuthorizationForm } from '../hooks/useAdministrationAuthorizationForm';
import { FormProvider } from 'react-hook-form';
import AuthorizationModalActions from '../components/AuthrizationModalActions';
import { useEffect } from 'react';
interface Props {
  open: boolean;
  onClose: () => void;
}
export const AdministrationAuthorizationModal = ({ open, onClose }: Props) => {
  const { methods, handleSubmit } = useAdministrationAuthorizationForm(onClose);

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
