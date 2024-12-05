import { MainCard } from '@/common/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormField } from '../components/FormField';
import { invoiceSettingsSchema, InvoiceSettingsSchema } from '../schema/invoicing.settings.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormActions } from '../components/FormActions';
import { useAddApiKey } from '../hooks/useAddApiKey';
import { useApiConfigStore } from '@/store/apiConfig';

const InvoiceSettingsView = () => {
  const apiUrl = useApiConfigStore((state) => state.apiUrl);
  const methods = useForm<InvoiceSettingsSchema>({
    resolver: zodResolver(invoiceSettingsSchema),
    values: {
      apiUrl: apiUrl || '',
    },
  });
  const { control, handleSubmit } = methods;
  const addApiKey = useAddApiKey();

  const onSubmit: SubmitHandler<InvoiceSettingsSchema> = async (data) => {
    await addApiKey.mutateAsync(data.apiUrl);
  };

  return (
    <MainCard title="Configuración de facturación">
      <form
        style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
      >
        <FormField name="apiUrl" control={control} label="URL de la API" sx={{ maxWidth: '500px' }} />
        <FormActions />
      </form>
    </MainCard>
  );
};

export default InvoiceSettingsView;
