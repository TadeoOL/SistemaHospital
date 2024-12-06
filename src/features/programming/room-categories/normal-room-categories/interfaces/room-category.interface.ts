// import { IRecoveryRoomOperatingRoom } from '@/types/operatingRoom/operatingRoomTypes';

export interface ICategoryNormalRoom {
  id_TipoCuarto?: string;
  nombre: string;
  descripcion?: string;
  intervaloReservacion?: string;
  tipo: number;
  precio?: number;
  // Contpaqi
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoProducto?: string;
  tipoProducto?: number;
  id_ProductoFactura?: string;
  iva?: boolean;
}
