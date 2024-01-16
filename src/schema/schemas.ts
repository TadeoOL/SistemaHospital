import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Escribe un correo valido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(30, "La contraseña no puede tener más de 30 caracteres"),
});
