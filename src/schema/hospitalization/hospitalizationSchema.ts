import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const toDate = (val: any) => (dayjs.isDayjs(val) ? val.toDate() : val);

export const biomedicalEquipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  price: z
    .union([
      z.string().refine((p) => p.trim() !== '', {
        message: 'El precio es necesario',
      }),
      z.number().refine((p) => p !== 0, {
        message: 'El precio tiene que ser mayor a 0',
      }),
    ])
    .transform((p) => {
      if (typeof p === 'string') {
        const parsed = parseFloat(p);
        if (isNaN(parsed)) {
          throw new Error('El precio debe ser un número válido');
        }
        return parsed;
      }
      return p;
    })
    .refine((p) => p !== 0, { message: 'El numero debe ser mayor a 0' }),
});

export const anesthesiologistSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido paterno es requerido'),
  secondLastName: z.string().min(1, 'El apellido materno es requerido'),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  age: z
    .union([
      z.string().refine((p) => p.trim() !== '', {
        message: 'El nombre es requerido',
      }),
      z.number().refine((p) => p !== 0, {
        message: 'La edad tiene que ser mayor a 0',
      }),
    ])
    .transform((p) => {
      if (typeof p === 'string') {
        const parsed = parseFloat(p);
        if (isNaN(parsed)) {
          throw new Error('La edad debe ser un número válido');
        }
        return parsed;
      }
      return p;
    })
    .refine((p) => p !== 0, { message: 'La edad debe ser mayor a 0' }),
  phoneNumber: z.string().min(1, 'El telefono es necesario'),
  email: z.string().email('El correo es necesario'),
});

export const xraySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  price: z
    .union([
      z.string().refine((p) => p.trim() !== '', {
        message: 'El precio es necesario',
      }),
      z.number().refine((p) => p !== 0, {
        message: 'El precio tiene que ser mayor a 0',
      }),
    ])
    .transform((p) => {
      if (typeof p === 'string') {
        const parsed = parseFloat(p);
        if (isNaN(parsed)) {
          throw new Error('El precio debe ser un número válido');
        }
        return parsed;
      }
      return p;
    })
    .refine((p) => p !== 0, { message: 'El numero debe ser mayor a 0' }),
});

export const medicSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido paterno es requerido'),
  secondLastName: z.string().min(1, 'El apellido materno es requerido'),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  age: z
    .union([
      z.string().refine((p) => p.trim() !== '', {
        message: 'El nombre es requerido',
      }),
      z.number().refine((p) => p !== 0, {
        message: 'La edad tiene que ser mayor a 0',
      }),
    ])
    .transform((p) => {
      if (typeof p === 'string') {
        const parsed = parseFloat(p);
        if (isNaN(parsed)) {
          throw new Error('La edad debe ser un número válido');
        }
        return parsed;
      }
      return p;
    })
    .refine((p) => p !== 0, { message: 'La edad debe ser mayor a 0' }),
  phoneNumber: z.string().min(1, 'El telefono es necesario'),
  email: z.string().email('El correo es necesario'),
});