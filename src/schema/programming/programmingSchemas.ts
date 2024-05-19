import { z } from 'zod';

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
