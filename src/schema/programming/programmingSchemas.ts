import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const toDate = (val: any) => (dayjs.isDayjs(val) ? val.toDate() : val);

export const patientRegistrationSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido Paterno es requerido'),
  secondLastName: z.string().min(1, 'Apellido Materno es requerido'),
  age: z.string().min(1, 'Edad es requerida'),
  genere: z.string().min(1, 'Genero es requerido'),
  civilStatus: z.string().min(1, 'Estado Civil es requerido'),
  phoneNumber: z.string().min(1, 'Teléfono es requerido'),
  occupation: z.string().min(1, 'Ocupación/Empleo es requerido'),
  zipCode: z.string().min(1, 'Código Postal es requerido'),
  neighborhood: z.string().min(1, 'Colonia es requerida'),
  address: z.string().min(1, 'Calle y Número es requerido'),
  personInCharge: z.string().min(1, 'Persona Responsable es requerida'),
  relationship: z.string().min(1, 'Parentesco es requerido'),
  sameAddress: z.boolean(),
  personInChargeZipCode: z.string().min(1, 'Código Postal es requerido'),
  personInChargeNeighborhood: z.string().min(1, 'Colonia es requerida'),
  personInChargeAddress: z.string().min(1, 'Calle y Número es requerido'),
  personInChargePhoneNumber: z.string().min(1, 'Teléfono es requerido'),
});

export const clinicalDataSchema = z.object({
  medicName: z.string().min(1, 'El nombre del médico es requerido'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  reasonForAdmission: z.string().min(1, 'El motivo de ingreso es requerido'),
  admissionDiagnosis: z.string().min(1, 'El diagnóstico de ingreso es requerido'),
  procedure: z.string().min(1, 'El procedimiento es requerido'),
  comments: z.string().optional(),
});

export const roomSchema = z.object({
  name: z.string().min(1, 'El nombre del cuarto es requerido'),
  roomType: z.string().min(1, 'El tipo de cuarto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
});

export const surgeryProcedureSchema = z.object({
  name: z.string().min(1, 'El nombre del cuarto es requerido'),
  surgeryDuration: z.string().min(1, 'La duración de la crujía es requerida'),
  hospitalizationDuration: z.string().min(1, 'La duración de hospitalization requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
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
