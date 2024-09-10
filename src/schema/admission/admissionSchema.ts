import { z } from 'zod';

export const medicalAndProcedureSchema = z.object({
  proceduresId: z.string().array().nonempty('Los procedimientos son requeridos'),
  medicId: z.string().min(1, 'Selecciona el medico'),
});
