import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const toDate = (val: any) => (dayjs.isDayjs(val) ? val.toDate() : val);

export const patientRegistrationSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido Paterno es requerido'),
  secondLastName: z.string().min(1, 'Apellido Materno es requerido'),
  age: z
    .string()
    .min(1, 'La edad es necesaria')
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'La edad tiene que ser mayor a 0',
    }),
  genere: z.string().min(1, 'Genero es requerido'),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
});

export const patientModifySchema = z.object({
  name: z.string().nullable(),
  lastName: z.string().nullable(),
  secondLastName: z.string().nullable(),
  age: z.string().nullable(),
  genere: z.string().nullable(),
  civilStatus: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  occupation: z.string().nullable(),
  zipCode: z.string().nullable(),
  neighborhood: z.string().nullable(),
  address: z.string().nullable(),
  personInCharge: z.string().nullable(),
  relationship: z.string().nullable(),
  sameAddress: z.boolean(),
  personInChargeZipCode: z.string().nullable(),
  personInChargeNeighborhood: z.string().nullable(),
  personInChargeAddress: z.string().nullable(),
  personInChargePhoneNumber: z.string().nullable(),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
});

export const clinicalDataSchema = z.object({
  reasonForAdmission: z.string().min(1, 'El motivo de ingreso es requerido'),
  admissionDiagnosis: z.string().min(1, 'El diagnóstico de ingreso es requerido'),
  allergies: z.string().min(1, 'El procedimiento es requerido'),
  bloodType: z.string().min(1, 'El tipo de sangre es requerido'),
  comments: z.string().optional(),
});

export const clinicalDataModifySchema = z.object({
  medicName: z.string().nullable(),
  specialty: z.string().nullable(),
  reasonForAdmission: z.string().nullable(),
  admissionDiagnosis: z.string().nullable(),
  allergies: z.string().nullable(),
  bloodType: z.string().nullable(),
  comments: z.string().nullable(),
  procedure: z.string().nullable(),
});

export const roomSchema = z.object({
  name: z.string().min(1, 'El nombre del cuarto es requerido'),
  roomType: z.string().min(1, 'El tipo de cuarto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
});

export const surgeryProcedureSchema = z.object({
  name: z.string().min(1, 'El nombre del cuarto es requerido'),
  surgeryDuration: z
    .string()
    .min(1, 'La duración de la crujía es requerida')
    .refine((val) => val !== '00:00:00', {
      message: 'La duración de la crujía es requerida',
    }),
  hospitalizationDuration: z
    .string()
    .min(1, 'La duración de hospitalización requerida')
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'La duración de hospitalización tiene que ser mayor a 0',
    }),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z
    .string()
    .min(1, 'El precio es necesario')
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'El precio tiene que ser mayor a 0',
    }),
});

export const addRoomReservation = z
  .object({
    room: z.string().min(1, 'La habitación es requerida'),
    startTime: z.preprocess(
      (val) => toDate(val as Dayjs),
      z.date().min(new Date(), 'La fecha de inicio debe ser posterior a la fecha actual')
    ),
    endDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  })
  .refine((data) => data.endDate >= data.startTime, {
    message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  });

export const procedureSchema = z.object({
  proceduresId: z
    .array(z.string().min(1, 'El ID del procedimiento no puede estar vacío'))
    .nonempty('El procedimiento es requerido'),
});

export const programmingRegisterSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido paterno es requerido'),
  secondLastName: z.string().min(1, 'El apellido materno es requerido'),
  age: z
    .string()
    .min(1, 'La edad es requerida')
    .refine((e) => parseInt(e) != 0, {
      message: 'La edad tiene que ser mayor a 0',
    }),
  doctorId: z.string().min(1, 'El medico es requerido'),
  notes: z.string().optional(),
  surgeryProcedures: z.string().array().nonempty({ message: 'El procedimiento es requerido' }),
  date: z.preprocess((val) => toDate(val as Dayjs), z.date()),
});

export const procedureAndDoctorSelectorSchema = z.object({
  proceduresId: z.string().array().nonempty('Los procedimientos son requeridos'),
  xrayIds: z.string().array().nonempty('Las radiografías son requeridas'),
  medicId: z.string().min(1, 'El medico es requerido'),
  anesthesiologistId: z.string().min(1, 'El anestesiólogo es requerido'),
});

export const medicPersonalBiomedicalEquipmentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z
    .string()
    .refine((p) => parseFloat(p) !== 0, {
      message: 'El precio tiene que ser mayor a 0',
    })
    .refine((p) => p !== '', {
      message: 'El precio tiene que ser mayor a 0',
    }),
});
