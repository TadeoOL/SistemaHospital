import { z } from 'zod';

export const addConcept = z.object({
  nombre: z.string().min(1, 'Escribe un nombre'),
  descripcion: z.string().min(1, 'Escribe una descripción'),
});
