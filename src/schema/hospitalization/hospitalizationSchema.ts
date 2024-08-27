import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const toDate = (val: any) => (dayjs.isDayjs(val) ? val.toDate() : val);

export const biomedicalEquipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  codigoContpaqi: z.string().nullable(),
  codigoSAT: z.string().nullable(),
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
  phoneNumber: z.string().min(1, 'El telefono es necesario'),
  email: z.string().email('El correo es necesario'),
});

export const xraySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  type: z.number().min(1, 'El tipo es requerido'),
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
  codigoContpaqi: z.string().nullable(),
  codigoSAT: z.string().nullable(),
});

export const medicSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido paterno es requerido'),
  secondLastName: z.string().min(1, 'El apellido materno es requerido'),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  phoneNumber: z.string().min(1, 'El telefono es necesario'),
  email: z.string().email('El correo es necesario'),
});

export const medicalShiftRegisterSchema = z
  .object({
    medicId: z.object(
      {
        id: z.string().min(1, 'El medico es necesario'),
      },
      {
        invalid_type_error: 'El medico es necesario',
      }
    ),
    startShift: z.preprocess((val) => toDate(val as Dayjs), z.date()),
    endShift: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  })
  .refine((args) => args.endShift >= args.startShift, {
    message: 'La fecha de finalización debe ser mayor a la fecha de inicio',
    path: ['endShift'],
  });

export const anesthesiologistShiftRegisterSchema = z
  .object({
    anesthesiologist: z.object(
      {
        id: z.string().min(1, 'El medico es necesario'),
      },
      {
        invalid_type_error: 'El medico es necesario',
      }
    ),
    startShift: z.preprocess((val) => toDate(val as Dayjs), z.date()),
    endShift: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  })
  .refine((args) => args.endShift >= args.startShift, {
    message: 'La fecha de finalización debe ser mayor a la fecha de inicio',
    path: ['endShift'],
  });

export const nurseSchema = z.object({
  nurse: z.object(
    {
      id_Enfermero: z.string(),
      nombre: z.string(),
    },
    {
      invalid_type_error: 'El enfermero es necesario',
    }
  ),
});

export const validateDates = z
  .object({
    startDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
    endDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  })
  .refine((args) => args.endDate >= args.startDate, {
    message: 'La fecha de finalización debe ser mayor a la fecha de inicio',
    path: ['endDate'],
  });
