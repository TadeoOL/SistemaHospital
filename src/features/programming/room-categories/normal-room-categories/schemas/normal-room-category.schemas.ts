import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const zodDay = z.custom<Dayjs>((val) => val instanceof dayjs, 'Fecha invalida').optional();

export const normalRoomCategory = z
  .object({
    name: z.string().min(1, 'El nombre del tipo de cuarto es requerido'),
    description: z.string().optional(),
    intervaloReservacion: zodDay,
    // priceByTimeRange: z.array(priceByTimeRange).optional(),
    // recoveryPriceByTimeRange: z.array(priceByTimeRange).optional(),
    type: z.string(),
    //codigoSATRecuperacion: z.string().nullable(),
    //codigoSAT: z.string().min(1, 'El código es necesario'),
    codigoUnidadMedida: z.number({ invalid_type_error: 'El código es necesario' }),
    codigoUnidadMedidaRecuperacion: z.number({ invalid_type_error: 'El código es necesario' }).optional(),
    priceRoom: z
      .string()
      .transform((val) => (val ? parseFloat(val).toFixed(2) : ''))
      .optional(),
  })
  .refine((values) => values.priceRoom && !(values.type === '0' && parseFloat(values.priceRoom) === 0), {
    message: 'El precio del cuarto es necesario',
    path: ['priceRoom'],
  });
