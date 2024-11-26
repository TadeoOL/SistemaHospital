import { phoneRegex } from '@/constants/regex';
import { z } from 'zod';

export const addNewProviderSchema = z.object({
  nombreCompania: z.string().min(3, 'Agrega una compañía'),
  nombreContacto: z.string().min(3, 'Agrega una contacto'),
  puesto: z.string().min(3, 'Agrega una puesto'),
  direccion: z.string().min(3, 'Agrega una dirección'),
  telefono: z
    .string()
    .regex(phoneRegex, 'Escribe un numero valido')
    .min(10, 'El numero debe contener 10 caracteres')
    .max(10, 'El numero debe contener 10 caracteres'),
  correoElectronico: z.string().email('Escribe una dirección de correo valida'),
  giroEmpresa: z.string().min(4, 'Agrega un giro de la empresa'),
  rfc: z.string().min(10, 'Agrega un rfc'),
  nif: z.string().min(4, 'Escribe una identificación fiscal'),
  tipoContribuyente: z.number().min(1, 'Selecciona un tipo de contribuyente'),
  direccionFiscal: z.string().min(4, 'Ingresa una dirección fiscal'),
  urlCertificadoBP: z.string().optional(),
  urlCeritificadoCR: z.string().optional(),
  urlCertificadoISO9001: z.string().optional(),
});
