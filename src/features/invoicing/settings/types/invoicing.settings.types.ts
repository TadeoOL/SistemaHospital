import { Control } from 'react-hook-form';
import { InvoiceSettingsSchema } from '../schema/invoicing.settings.schema';
import { SxProps } from '@mui/material';

export interface FormFieldProps {
  name: keyof InvoiceSettingsSchema;
  control: Control<InvoiceSettingsSchema>;
  label: string;
  error?: string;
  type?: 'text' | 'number';
  disabled?: boolean;
  sx?: SxProps;
}

export interface InvoiceSettings {
  apiUrl: string;
}
