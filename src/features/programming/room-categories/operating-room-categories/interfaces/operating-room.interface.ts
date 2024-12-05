interface ConfiguracionPrecio {
  hospitalizacion: IRoomPriceRange[];
  ambulatoria: IRoomPriceRange[];
}

export interface ICategoryOperatingRoom {
  id_TipoCuarto?: string;
  id_TipoQuirofano?: string;
  nombre: string;
  descripcion?: string;
  intervaloReservacion?: string;
  configuracionPrecio: ConfiguracionPrecio;
  configuracionPrecioRecuperacion: IRoomPriceRange[];
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
