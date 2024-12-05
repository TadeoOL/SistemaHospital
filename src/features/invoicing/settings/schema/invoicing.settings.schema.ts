import { z } from 'zod';

export const invoiceSettingsSchema = z.object({
  apiUrl: z.string().min(1, { message: 'La URL de la API es requerida' }),
});

export type InvoiceSettingsSchema = z.infer<typeof invoiceSettingsSchema>;
