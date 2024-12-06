import { z } from 'zod';

export const invoiceServiceSchema = z.object({
  codigoSAT: z.string().min(1, 'El código SAT es necesario').max(8, 'El código SAT debe tener máximo 8 caracteres'),
  codigoUnidadMedida: z
    .number({ invalid_type_error: 'El código de Unidad de Medida es necesario' })
    .min(1, 'El código es necesario'),
  codigoProducto: z.string().optional().nullable(),
  tipoProducto: z.number({ invalid_type_error: 'El tipo de Producto es necesario' }).min(1, 'El tipo es necesario'),
});
