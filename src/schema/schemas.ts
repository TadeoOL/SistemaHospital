import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

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
  telefono: z.string().regex(phoneRegex, "Numero invalido!"),
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

export const addNewProviderSchema = z.object({
  nombreCompania: z.string().min(3, "Agrega una compañia"),
  nombreContacto: z.string().min(3, "Agrega una contacto"),
  puesto: z.string().min(3, "Agrega una puesto"),
  direccion: z.string().min(3, "Agrega una direccion"),
  telefono: z
    .string()
    .regex(phoneRegex, "Escribe un numero valido")
    .min(10, "El numero debe contener 10 caracteres")
    .max(10, "El numero debe contener 10 caracteres"),
  email: z.string().email("Escribe una direccion de correo valida"),
});
