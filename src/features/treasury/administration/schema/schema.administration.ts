import { z } from 'zod';

export const authorizationSchema = z.object({
  id_ConceptoSalida: z.string().min(0, 'El concepto de salida es requerido'),
  cantidad: z.number().min(1, 'La cantidad es requerida'),
  motivo: z.string().min(1, 'El motivo es requerido'),
});

export type AuthorizationSchema = z.infer<typeof authorizationSchema>;
