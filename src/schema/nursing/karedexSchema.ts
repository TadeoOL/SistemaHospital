import { z } from 'zod';

export const kardexMedicationsSchema = z.object({
  id_Articulo: z.string().optional(),
  nombreArticulo: z.string().optional(),
  dosis: z.string().optional(),
  frecuencia: z.string().optional(),
  via: z.string().optional(),
  horario: z.string().optional(),
});

export const kardexServicesSchema = z.object({
  id_Servicio: z.string().min(1, 'El servicio es requerido'),
  indicaciones: z.string().optional(),
});

export const kardexSolutionsSchema = z.object({
  id_Articulo: z.string().min(1, 'El artículo es requerido'),
  nombreArticulo: z.string().optional(),
});

export const kardexSchema = z
  .object({
    id_IngresoPaciente: z.string().optional(),
    indicacionesMedicas: z.string().optional(),
    indicacionSoluciones: z.string().optional(),
    observaciones: z.string().optional(),
    medicamentos: z.array(kardexMedicationsSchema).optional(),
    servicios: z.array(kardexServicesSchema).optional(),
    soluciones: z.array(kardexSolutionsSchema).optional(),
  })
  .refine(
    (data) => {
      return !!(
        data.indicacionesMedicas ||
        data.observaciones ||
        (data.medicamentos && data.medicamentos.length > 0) ||
        (data.servicios && data.servicios.length > 0) ||
        (data.soluciones && data.soluciones.length > 0)
      );
    },
    {
      message: 'Debe llenar al menos un campo para poder crear el kardex.',
      path: ['id_IngresoPaciente'],
    }
  );

export type KardexFormData = z.infer<typeof kardexSchema>;
