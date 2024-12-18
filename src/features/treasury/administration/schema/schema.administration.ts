import { z } from 'zod';

const baseAuthorizationSchema = z.object({
  id_ConceptoSalida: z.string().min(0, 'El concepto de salida es requerido'),
  cantidad: z.number().min(1, 'La cantidad es requerida'),
  motivo: z.string().min(1, 'El motivo es requerido'),
});

export type AuthorizationSchema = z.infer<typeof baseAuthorizationSchema>;

export const authorizationSchema = (fund: number) =>
  baseAuthorizationSchema.superRefine((data, ctx) => {
    if (data.cantidad > fund) {
      ctx.addIssue({
        path: ['cantidad'],
        code: z.ZodIssueCode.custom,
        message: `La cantidad no puede ser mayor que el fondo ${fund}`,
      });
    }
  });
