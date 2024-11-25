import { z } from 'zod';

export const addArticle = z.object({
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
  // codigoSAT: z.string().min(1, 'Escribe un código valido'),
  presentacion: z.string().min(1, 'Escribe una presentación'),
});
