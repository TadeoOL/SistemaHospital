import { z } from 'zod';

export const vitalSignsSchema = z.object({
  id_IngresoPaciente: z.string(),
  fechaSignosPaciente: z.string(),
  tensionArterial: z.number().nullable(),
  frecuenciaRespiratoriaFrecuenciaCardiaca: z.number().nullable(),
  temperaturaCorporal: z.number().nullable(),
  saturacionOxigeno: z.number().nullable(),
  glicemia: z.number().nullable(),
  estadoConciencia: z.string().nullable(),
  escalaDolor: z.number()
    .min(0, "La escala de dolor debe ser mayor o igual a 0")
    .max(10, "La escala de dolor no puede ser mayor a 10")
    .nullable()
    .transform(val => (val === null ? null : Number(val))),
});

export type VitalSignsFormData = z.infer<typeof vitalSignsSchema>;
  