import { invoiceServiceSchema } from '@/schema/contpaqi/contpaqi.schema';
import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const zodDay = z.custom<Dayjs>((val) => val instanceof dayjs, 'Fecha invalida').optional();

export const operatingRoomPriceRangeSchema = z
  .object({
    horaInicio: z.number().min(0, 'La hora inicio es necesaria'),
    horaFin: z.number().nullable(),
    precio: z
      .number()
      //.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      //  message: 'El precio debe ser un número decimal positivo',
      //})
      //.transform((val) => parseFloat(val)),
  })
  .refine(
    (val) => {
      return Number(val.horaInicio) <= Number(val.horaFin) || val.horaFin === null;
    },
    {
      message: 'La hora inicial debe ser menor a la final',
      path: ['horaInicio'],
    }
  );

export const operatingRoomCategorySchema = (hasInvoiceService?: boolean) =>
  z.object({
    name: z.string().min(1, 'El nombre del tipo de cuarto es requerido'),
    description: z.string().optional(),
    intervaloReservacion: zodDay,
    codigoUnidadMedida: z.number({ invalid_type_error: 'El código es necesario' }),
    codigoUnidadMedidaRecuperacion: z.number({ invalid_type_error: 'El código es necesario' }).optional(),

    priceByTimeRangeHospitalization: z.array(operatingRoomPriceRangeSchema).optional(),
    priceByTimeRangeRecovery: z.array(operatingRoomPriceRangeSchema).optional(),
    priceByTimeRangeOutpatient: z.array(operatingRoomPriceRangeSchema).optional(),
    ...(hasInvoiceService && {
      ...invoiceServiceSchema.shape,
      codigoSATRecuperacion: z.string().min(1, 'El código SAT de recuperación es necesario'),
      codigoUnidadMedidaRecuperacion: z
        .number({ invalid_type_error: 'El código es necesario' })
        .min(1, 'El código es necesario'),
    }),
  });
