import { invoiceServiceSchema } from '@/schema/contpaqi/contpaqi.schema';
import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const zodDay = z.custom<Dayjs>((val) => val instanceof dayjs, 'Fecha invalida').optional();

export const normalRoomCategorySchema = (hasInvoiceService?: boolean) =>
  z
    .object({
      name: z.string().min(1, 'El nombre del tipo de cuarto es requerido'),
      description: z.string().optional(),
      intervaloReservacion: zodDay,
      type: z.string(),
      priceRoom: z
        .string()
        .transform((val) => (val ? parseFloat(val).toFixed(2) : ''))
        .optional(),
      ...(hasInvoiceService && invoiceServiceSchema.shape),
    })
    .refine((values) => values.priceRoom && !(values.type === '0' && parseFloat(values.priceRoom) === 0), {
      message: 'El precio del cuarto es necesario',
      path: ['priceRoom'],
    });
