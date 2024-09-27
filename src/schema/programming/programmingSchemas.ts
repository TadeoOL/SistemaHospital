import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

const toDate = (val: any) => (dayjs.isDayjs(val) ? val.toDate() : val);
const zodDay = z.custom<Dayjs>((val) => val instanceof dayjs, 'Fecha invalida').optional();

const priceSchema = z
  .string()
  .refine((p) => parseFloat(p) !== 0, {
    message: 'El precio tiene que ser mayor a 0',
  })
  .refine((p) => p !== '', {
    message: 'El precio tiene que ser mayor a 0',
  });

export const patientRegistrationSchema = z.object({
  name: z.string().optional(),
  lastName: z.string().optional(),
  secondLastName: z.string().optional(),
  genere: z.string().optional(),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
});

export const patientModifySchema = z.object({
  name: z.string().nullable(),
  lastName: z.string().nullable(),
  secondLastName: z.string().nullable(),
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
  state: z.string().nullable(),
  city: z.string().nullable(),
  birthDate: z.preprocess((val) => toDate(val as Dayjs), z.date()),
});

export const patientSAMISchema = z.object({
  name: z.string().min(1, 'Es necesario el nombre'),
  lastName: z.string().min(1, 'Es necesario el apellido paterno'),
  secondLastName: z.string().min(1, 'Es necesario materno'),
  genere: z.string().min(1, 'Es necesario el genero'),
  civilStatus: z.string().min(1, 'Es necesario estado civil'),
  phoneNumber: z.string().min(1, 'Es necesario telefono'),
  zipCode: z.string().min(1, 'Es necesario codigo postal'),
  neighborhood: z.string().min(1, 'Es necesario colonia'),
  address: z.string().min(1, 'Es necesario la direccion'),
  birthDate: z.preprocess(
    (val) => toDate(val as Dayjs),
    z.date({
      invalid_type_error: 'Escribe una fecha de nacimiento',
    })
  ),
  personInCharge: z.string().min(1, 'Es necesario el nombre del responsable'),
});

export const clinicalDataSchema = z.object({
  reasonForAdmission: z.string().optional(),
  admissionDiagnosis: z.string().optional(),
  allergies: z.string().optional(),
  bloodType: z.string().optional(),
  comments: z.string().optional(),
});

export const clinicalDataModifySchema = z.object({
  reasonForAdmission: z.string().nullable(),
  admissionDiagnosis: z.string().nullable(),
  allergies: z.string().nullable(),
  bloodType: z.string().nullable(),
  comments: z.string().nullable(),
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
    .min(1, 'La duración de la cirugía es requerida')
    .refine((val) => val !== '00:00:00', {
      message: 'La duración de la cirugía es requerida',
    }),
  hospitalizationDuration: z
    .string()
    .min(1, 'La duración de hospitalización requerida')
    .refine((val) => parseInt(val, 10) > 0, {
      message: 'La duración de hospitalización tiene que ser mayor a 0',
    }),
  description: z.string().optional(),
  price: z.string().optional(),
  codigoSAT: z.string().min(1, 'El código es necesario'),
  codigoUnidadMedida: z.number({invalid_type_error: 'El código es necesario'}),
});

export const addRoomReservation = z
  .object({
    room: z.string().min(1, 'El espacio es requerido'),
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
  notes: z.string().optional(),
  surgeryProcedures: z.string().array().nonempty({ message: 'El procedimiento es requerido' }),
  date: z.preprocess((val) => toDate(val as Dayjs), z.date()),
  doctorId:z.string().min(1, 'Es necesario seleccionar un doctor'),
});

export const procedureAndDoctorSelectorSchema = z.object({
  proceduresId: z.string().array().nonempty('Los procedimientos son requeridos'),
  xrayIds: z.string().array().nullable(),
  medicId: z.string().min(1, 'Selecciona el medico'),
  anesthesiologistId: z.string().nullable(),
});

export const medicPersonalBiomedicalEquipmentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: priceSchema,
  notes: z.string().optional(),
});

const priceByTimeRange = z
  .object({
    inicio: z.string().min(1, 'La hora inicio es necesaria'),
    fin: z.string().nullable(),
    precio: z.number().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El precio debe ser un número decimal positivo',
    }),
    noneHour: z.boolean().optional(),
  })
  .refine(
    (val) => {
      if (!val.noneHour && val.fin) {
        return val.inicio <= val.fin;
      }
      return true;
    },
    {
      message: 'La hora inicial debe ser menor a la final',
      path: ['inicio'],
    }
  )
  .optional();

export const typeRoomSchema = z
  .object({
    name: z.string().min(1, 'El nombre del tipo de cuarto es requerido'),
    description: z.string().optional(),
    reservedSpaceTime: zodDay,
    priceByTimeRange: z.array(priceByTimeRange).optional(),
    recoveryPriceByTimeRange: z.array(priceByTimeRange).optional(),
    type: z.string(),
    codigoSATRecuperacion: z.string().nullable(),
    codigoSAT: z.string().min(1, 'El código es necesario'),
    codigoUnidadMedida: z.number({invalid_type_error: 'El código es necesario'}),
    codigoUnidadMedidaRecuperacion: z.number({invalid_type_error: 'El código es necesario'}).optional(),
    priceRoom: z
      .string()
      .transform((val) => (val ? parseFloat(val).toFixed(2) : ''))
      .optional(),
  })
  .refine((values) => values.priceRoom && !(values.type === '0' && parseFloat(values.priceRoom) === 0), {
    message: 'El precio del cuarto es necesario',
    path: ['priceRoom'],
  })
  .refine(
    (values) => values.type !== '1' || (values.codigoSATRecuperacion && values.codigoSATRecuperacion.length > 0),
    {
      message: 'El código de SAT de Recuperación es necesario para quirófanos',
      path: ['codigoSATRecuperacion'],
    }
  )
  .refine(
    (values) => values.type !== '1' || (values.codigoUnidadMedidaRecuperacion),
    {
      message: 'El código de Unidad de Medida de Recuperación es necesario para quirófanos',
      path: ['codigoUnidadMedidaRecuperacion'],
    }
  );
