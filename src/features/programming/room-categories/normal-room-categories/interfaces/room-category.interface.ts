import { IRecoveryRoomOperatingRoom } from '@/types/operatingRoom/operatingRoomTypes';

export interface ICategoryRoom {
  id_TipoCuarto?: string;
  id_TipoQuirofano?: string;
  nombre: string;
  descripcion?: string;
  configuracionLimpieza?: string;
  configuracionPrecioHora?: IRecoveryRoomOperatingRoom[];
  configuracionRecuperacion?: IRecoveryRoomOperatingRoom[];
  tipo: number;
  precio?: number;
  codigoSATRecuperacion?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  codigoUnidadMedidaRecuperacion?: number;
}
