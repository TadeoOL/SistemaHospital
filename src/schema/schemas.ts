import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(3, "Escribe un nombre de usuario valido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(30, "La contraseña no puede tener más de 30 caracteres"),
});

export const userSettingsSchema = z.object({
  nombre: z.string().min(3, "Escribe un nombre valido de almenos 3 caracteres"),
  apellidoPaterno: z.string().min(1, "Escribe un apellido paterno"),
  apellidoMaterno: z.string().min(1, "Escribe un apellido paterno"),
  email: z.string().email("Escribe un correo electronico valido"),
  telefono: z
    .string()
    .min(10, "Escribe un numero de telefono")
    .max(10, "Escribe un numero de telefono"),
  imagenURL: z.string().optional(),
});

export const addNewUserSchema = z
  .object({
    contrasena: z.string().refine(
      (value) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]+$/;
        return regex.test(value);
      },
      {
        message:
          "La contraseña debe contener al menos una letra mayúscula y un número.",
      }
    ),
    confirmarContrasena: z.string(),
    email: z.string().email("Escribe un correo electronico valido"),
    nombre: z
      .string()
      .min(3, "Escribe un nombre de usuario valido mayor a 3 caracteres"),
    apellidoPaterno: z.string().min(1, "Escribe un apellido paterno"),
    apellidoMaterno: z.string().min(1, "Escribe un apellido paterno"),
    telefono: z
      .string()
      .min(10, "Escribe un numero de telefono valido")
      .max(10, "Escribe un numero de telefono valido"),
    roles: z
      .string()
      .array()
      .refine((data) => data.length !== 0, {
        message: "Debe seleccionar almenos un rol.",
      }),
    nombreUsuario: z
      .string()
      .min(4, "Escribe un nombre de usuario valido de almenos 4 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });
