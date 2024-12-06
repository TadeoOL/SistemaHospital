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
      ...(hasInvoiceService && {
        codigoSAT: z.string().min(1, 'El código SAT es necesario'),
        codigoUnidadMedida: z.number({ invalid_type_error: 'El código de Unidad de Medida es necesario' }),
        codigoProducto: z.string().optional().nullable(),
        tipoProducto: z.number({ invalid_type_error: 'El tipo de Producto es necesario' }),
      }),
    })
    .refine((values) => values.priceRoom && !(values.type === '0' && parseFloat(values.priceRoom) === 0), {
      message: 'El precio del cuarto es necesario',
      path: ['priceRoom'],
    });
