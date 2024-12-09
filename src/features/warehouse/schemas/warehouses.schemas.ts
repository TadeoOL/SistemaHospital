import { z } from 'zod';

export const addWarehouse = z.object({
  nombre: z.string().min(1, 'Escribe un nombre'),
  descripcion: z.string().nullish(),
});
