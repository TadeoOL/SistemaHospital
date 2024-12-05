import { z } from 'zod';

export const addArticle = (hasApiUrl?: boolean) =>
  z.object({
    nombre: z.string().min(1, 'Escribe un nombre'),
    descripcion: z.string().nullable(),
    precioCompra: z
      .string()
      .nullable() // Permitir valores nulos
      .refine(
        (value) => {
          if (value === null) {
            return false; // Rechazar valores nulos
          }
          const parsedValue = parseFloat(value);
          return !isNaN(parsedValue) && parsedValue > 0;
        },
        { message: 'Escribe una cantidad válida y mayor que cero' }
      ),
    precioVentaExterno: z
      .any()
      .nullable() // Permitir valores nulos
      .refine(
        (value) => {
          if (value === null) {
            return false; // Rechazar valores nulos
          }
          const parsedValue = parseFloat(value);
          return !isNaN(parsedValue) && parsedValue > 0;
        },
        { message: 'Escribe una cantidad válida y mayor que cero' }
      ),
    precioVentaInterno: z
      .any()
      .nullable() // Permitir valores nulos
      .refine(
        (value) => {
          if (value === null) {
            return false; // Rechazar valores nulos
          }
          const parsedValue = parseFloat(value);
          return !isNaN(parsedValue) && parsedValue > 0;
        },
        { message: 'Escribe una cantidad válida y mayor que cero' }
      ),
    id_subcategoria: z.string().min(1, 'Selecciona una sub categoría'),
    codigoBarras: z.string().nullable(),
    presentacion: z.string().min(1, 'Escribe una presentación'),
    ...(hasApiUrl && {
      codigoSAT: z
        .string({ invalid_type_error: 'Escribe un código SAT valido' })
        .min(1, 'Escribe un código SAT valido'),
      codigoUnidadMedida: z
        .string({ invalid_type_error: 'Escribe un código de unidad de medida valido' })
        .min(1, 'Escribe un código de unidad de medida valido'),
      codigoProducto: z.string({ invalid_type_error: 'Escribe un código de producto valido' }).optional(),
      tipoProducto: z
        .number({ invalid_type_error: 'Selecciona un tipo de producto' })
        .min(1, 'Selecciona un tipo de producto'),
      id_ProductoFactura: z.string().optional().nullable(),
      id_Relacion: z.string().optional().nullable(),
    }),
  });
