import { z } from 'zod';

export const addCategory = z.object({
  nombre: z.string().min(1, 'Escribe un nombre'),
  descripcion: z.string().min(1, 'Escribe una descripción'),
  id_Almacen: z.string().min(1, 'Selecciona un almacén'),
});
