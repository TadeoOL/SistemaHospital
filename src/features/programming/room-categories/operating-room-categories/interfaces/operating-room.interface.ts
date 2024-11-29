export interface ICategoryOperatingRoom {
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

export interface IRoomPriceRange {
  horaInicio: string;
  horaFin: string | null;
  inicio?: string;
  fin?: string;
  precio: string;
}
