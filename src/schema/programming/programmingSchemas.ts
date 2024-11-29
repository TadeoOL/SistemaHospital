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

const createPatientSchema = (required: boolean, isEditing?: boolean) => {
  const stringField = (message: string) => (required ? z.string().min(1, message) : z.string().optional());
  const clinicalField = (message: string) =>
    required && isEditing ? z.string().min(1, message) : z.string().optional();

  return z.object({
    name: stringField('El nombre es requerido'),
    lastName: stringField('El apellido paterno es requerido'),
    secondLastName: stringField('El apellido materno es requerido'),
    genere: stringField('El genero es requerido'),
    civilStatus: stringField('El estado civil es requerido'),
    phoneNumber: stringField('El telefono es requerido'),
    occupation: stringField('La ocupación es requerida'),
    zipCode: stringField('El codigo postal es requerido'),
    neighborhood: stringField('La colonia es requerida'),
    address: stringField('La direccion es requerida'),
    personInCharge: stringField('El nombre del responsable es requerido'),
    relationship: stringField('La relacion es requerida'),
    sameAddress: required ? z.boolean() : z.boolean().optional(),
    personInChargeZipCode: stringField('El codigo postal del responsable es requerido'),
    personInChargeNeighborhood: stringField('La colonia del responsable es requerida'),
    personInChargeAddress: stringField('La direccion del responsable es requerida'),
    personInChargePhoneNumber: stringField('El telefono del responsable es requerido'),
    personInChargeCity: stringField('La ciudad del responsable es requerida'),
    personInChargeState: stringField('El estado del responsable es requerido'),
    state: stringField('El estado es requerido'),
    city: stringField('La ciudad es requerida'),
    curp: stringField('La CURP es requerida'),
    birthDate: required
      ? z.preprocess((val) => toDate(val as Dayjs), z.date())
      : z.preprocess((val) => toDate(val as Dayjs), z.date()).optional(),
    allergies: clinicalField('Las alergias son requeridas'),
    bloodType: clinicalField('El tipo de sangre es requerido'),
    comments: z.string().optional(),
    reasonForAdmission: clinicalField('La razón de admisión es requerida'),
    admissionDiagnosis: clinicalField('El diagnóstico de admisión es requerido'),
  });
};

export const basePatientSchema = createPatientSchema(false, false);
export const admissionPatientSchema = createPatientSchema(true, false);
export const editAdmissionPatientSchema = createPatientSchema(true, true);

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
  medicId: z.string().min(1, 'Es necesario seleccionar un medico'),
});

export type PatientSamiType = z.infer<typeof patientSAMISchema>;

export const clinicalDataSchema = (hospitalization?: boolean) =>
  z
    .object({
      reasonForAdmission: z.string().optional(),
      admissionDiagnosis: z.string().optional(),
      allergies: z.string().optional(),
      bloodType: z.string().optional(),
      comments: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!hospitalization) return;
      if (!data.reasonForAdmission) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La razón de admisión es requerida',
          path: ['reasonForAdmission'],
        });
      }
      if (!data.admissionDiagnosis) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La diagnóstico de admisión es requerido',
          path: ['admissionDiagnosis'],
        });
      }
      if (!data.allergies) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Las alergias son requeridas',
          path: ['allergies'],
        });
      }
      if (!data.bloodType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El tipo de sangre es requerido',
          path: ['bloodType'],
        });
      }
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
  roomType: z.string().min(1, 'El tipo de espacio es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  type: z.number().optional(),
});

export const surgeryProcedureSchema = z.object({
  name: z.string().min(1, 'El nombre del cuarto es requerido'),
  description: z.string().optional(),
  price: z.number().optional(),
});

export const addRoomReservation = z
  .object({
    room: z.string().min(1, 'El espacio es requerido'),
    startTime: z.preprocess(
      (val) => toDate(val as Dayjs),
      z.date().min(new Date(), 'La fecha de inicio debe ser posterior a la fecha actual')
    ),
    stayDays: z
      .number({ invalid_type_error: 'Debe ser un número entero' })
      .min(1, 'Debe ser al menos 1 día')
      .max(365, 'No puede exceder los 365 días')
      .int('Debe ser un número entero')
      .optional(),
    endDate: z
      .preprocess(
        (val) => toDate(val as Dayjs),
        z.date({
          invalid_type_error: 'La fecha de salida no es válida',
          required_error: 'La fecha de salida es requerida',
        })
      )
      .refine((date) => date > new Date(), {
        message: 'La fecha de salida debe ser posterior a la fecha actual',
      })
      .optional(),
  })
  .transform((data) => {
    if (data.stayDays) {
      return {
        ...data,
        endDate: dayjs(data.startTime).add(data.stayDays, 'day').toDate(),
      };
    }
    return data;
  })
  .refine((data) => data.endDate && data.endDate >= data.startTime, {
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
  doctorId: z.string().min(1, 'Es necesario seleccionar un doctor'),
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
    horaInicio: z.string().min(1, 'La hora inicio es necesaria'),
    horaFin: z.string().nullable(),
    precio: z.number().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El precio debe ser un número decimal positivo',
    }),
    noneHour: z.boolean().optional(),
  })
  .refine(
    (val) => {
      if (!val.noneHour && val.horaFin) {
        return val.horaInicio <= val.horaFin;
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
    intervaloReservacion: zodDay,
    priceByTimeRange: z.array(priceByTimeRange).optional(),
    recoveryPriceByTimeRange: z.array(priceByTimeRange).optional(),
    type: z.string(),
    //codigoSATRecuperacion: z.string().nullable(),
    //codigoSAT: z.string().min(1, 'El código es necesario'),
    codigoUnidadMedida: z.number({ invalid_type_error: 'El código es necesario' }),
    codigoUnidadMedidaRecuperacion: z.number({ invalid_type_error: 'El código es necesario' }).optional(),
    priceRoom: z
      .string()
      .transform((val) => (val ? parseFloat(val).toFixed(2) : ''))
      .optional(),
  })
  .refine((values) => values.priceRoom && !(values.type === '0' && parseFloat(values.priceRoom) === 0), {
    message: 'El precio del cuarto es necesario',
    path: ['priceRoom'],
  });
/*.refine(
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
  );*/
