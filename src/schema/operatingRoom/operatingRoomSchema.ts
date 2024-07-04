import { z } from 'zod';

export const recoveryRoomOperatingRoomSchema = z
  .object({
    inicio: z.string().min(1, 'La hora inicio es necesaria'),
    fin: z.string(),
    precio: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'El precio debe ser un número decimal positivo',
      })
      .transform((val) => parseFloat(val)),
    noneHour: z.boolean(),
  })
  .refine(
    (val) => {
      if (!val.noneHour) {
        return val.inicio <= val.fin;
      }
      return true;
    },
    {
      message: 'La hora inicial debe ser menor a la final',
      path: ['inicio'],
    }
  );
