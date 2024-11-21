export const DISCOUNT_TYPES = {
  Porcentaje: 1,
  Monto: 2,
} as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];
export type DiscountTypeKey = keyof typeof DISCOUNT_TYPES;

export interface IDiscount {
  id: string;
  id_CuentaPaciente: string;
  montoDescuento: number;
  motivoDescuento: string;
  tipoDescuento: DiscountTypeKey;
  usuarioEncargadoDescuento: { id: string; nombre: string };
  fechaCreacion: string;
  fechaModificacion: string;
}
