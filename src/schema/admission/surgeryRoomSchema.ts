import { z } from 'zod';
import dayjs from 'dayjs';

export const validateDatesSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    roomId: z.string(),
    doctorId: z.string(),
    surgeryPackageId: z.string(),
  })
  .refine(
    (data) => {
      return dayjs(data.startDate).isBefore(dayjs(data.endDate));
    },
    {
      message: 'La fecha de inicio debe ser anterior a la fecha de fin',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      return dayjs(data.startDate).isAfter(dayjs());
    },
    {
      message: 'La fecha de inicio no puede ser anterior a la fecha actual',
      path: ['startDate'],
    }
  );

export type SurgeryRoomFormInputs = z.infer<typeof validateDatesSchema>;
