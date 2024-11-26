import { z } from 'zod';

export const addSubCategorySchema = z.object({
  nombre: z.string().min(1, 'Escribe un nombre'),
  descripcion: z.string().nullable().optional(),
  id_categoria: z.string().min(1, 'Selecciona una categoría'),
  iva: z.boolean(),
});
