// import { IRecoveryRoomOperatingRoom } from '@/types/operatingRoom/operatingRoomTypes';

export interface ICategoryNormalRoom {
  id_TipoCuarto?: string;
  id_TipoQuirofano?: string;
  nombre: string;
  descripcion?: string;
  intervaloReservacion?: string;
  // configuracionPrecioHora?: IRecoveryRoomOperatingRoom[];
  // configuracionRecuperacion?: IRecoveryRoomOperatingRoom[];
  tipo: number;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}
