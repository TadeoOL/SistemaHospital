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
    email: z.string().email("Escribe un correo electrónico valido"),
    nombre: z
      .string()
      .min(3, "Escribe un nombre de usuario valido mayor a 3 caracteres"),
    apellidoPaterno: z.string().min(1, "Escribe un apellido paterno"),
    apellidoMaterno: z.string().min(1, "Escribe un apellido paterno"),
    telefono: z
      .string()
      .min(10, "Escribe un numero de teléfono valido")
      .max(10, "Escribe un numero de teléfono valido"),
    roles: z
      .string()
      .array()
      .refine((data) => data.length !== 0, {
        message: "Debe seleccionar al menos un rol.",
      }),
    nombreUsuario: z
      .string()
      .min(4, "Escribe un nombre de usuario valido de al menos 4 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

export const addNewProviderSchema = z.object({
  nombreCompania: z.string().min(3, "Agrega una compañía"),
  nombreContacto: z.string().min(3, "Agrega una contacto"),
  puesto: z.string().min(3, "Agrega una puesto"),
  direccion: z.string().min(3, "Agrega una dirección"),
  telefono: z
    .string()
    .regex(phoneRegex, "Escribe un numero valido")
    .min(10, "El numero debe contener 10 caracteres")
    .max(10, "El numero debe contener 10 caracteres"),
  correoElectronico: z.string().email("Escribe una dirección de correo valida"),
  giroEmpresa: z.string().min(4, "Agrega un giro de la empresa"),
  rfc: z.string().min(10, "Agrega un rfc"),
  nif: z.string().min(4, "Escribe una identificación fiscal"),
  tipoContribuyente: z.number().min(1, "Selecciona un tipo de contribuyente"),
  direccionFiscal: z.string().min(4, "Ingresa una dirección fiscal"),
  urlCertificadoBP: z.string().nullable().optional(),
  urlCeritificadoCR: z.string().nullable().optional(),
  urlCertificadoISO9001: z.string().nullable().optional(),
});

export const addSubCategory = z.object({
  nombre: z.string().min(1, "Escribe un nombre"),
  descripcion: z.string().min(1, "Escribe una descripción"),
  id_categoria: z.string().min(1, "Selecciona una categoría"),
});

export const addCategory = z.object({
  nombre: z.string().min(1, "Escribe un nombre"),
  descripcion: z.string().min(1, "Escribe una descripción"),
});

export const addArticle = z.object({
  nombre: z.string().min(1, "Escribe un nombre"),
  codigoBarras: z.string().min(1, "Escribe un código de barras"),
  descripcion: z.string().min(1, "Escribe una descripción"),
  stockMinimo: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    { message: "Escribe una cantidad válida y mayor que cero" }
  ),
  stockAlerta: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    { message: "Escribe una cantidad válida y mayor que cero" }
  ),
  unidadMedida: z.string().min(1, "Selecciona una unidad de medida"),
  id_subcategoria: z.string().min(1, "Selecciona una sub categoría"),
});

export const addExistingArticle = z
  .object({
    id_articulo: z.string().min(1, "Selecciona un articulo"),
    id_almacen: z.string().min(1, "Selecciona un almacén"),
    cantidad: z.string().refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      { message: "Escribe una cantidad válida y mayor que cero" }
    ),
    precioCompra: z.string().refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      { message: "Escribe una cantidad válida y mayor que cero" }
    ),
    precioVenta: z.string().refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      { message: "Escribe una cantidad válida y mayor que cero" }
    ),
    fechaCompra: z.string().min(1, "Selecciona una fecha de compra"),
    fechaCaducidad: z.string().min(1, "Selecciona una fecha de caducidad"),
    factor: z.string().refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      { message: "Escribe una cantidad válida y mayor que cero" }
    ),
  })
  .refine(
    (data) => {
      const fechaCompra = new Date(data.fechaCompra);
      const fechaCaducidad = new Date(data.fechaCaducidad);
      return fechaCompra <= fechaCaducidad;
    },
    {
      message: "La fecha de compra debe ser menor a la fecha de caducidad",
      path: ["fechaCompra"],
    }
  );

export const addWarehouse = z.object({
  nombre: z.string().min(1, "Escribe un nombre"),
  descripcion: z.string().min(1, "Escribe una descripción"),
});

export const addPurchase = z.object({
  id_articulo: z.string().min(1, "Selecciona un articulo"),
  cantidad: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    { message: "Escribe una cantidad válida y mayor que cero" }
  ),
});
