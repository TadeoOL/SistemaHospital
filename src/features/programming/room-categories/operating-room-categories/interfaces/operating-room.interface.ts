interface ConfiguracionPrecio {
  hospitalizacion: IRoomPriceRange[];
  ambulatoria: IRoomPriceRange[];
}

export interface ICategoryOperatingRoom {
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
  //Facturacion
  codigoProducto?: string;
  codigoSAT?: string;
  codigoUnidadMedida?: number;
  id_ProductoFactura?: string;
  iva?: boolean;
  //Facturacion Recuperacion
  codigoSATRecuperacion?: string;
  codigoProductoRecuperacion?: string;
  codigoUnidadMedidaRecuperacion?: number;
  ivaRecuperacion?: boolean;
}

export interface IRoomPriceRange {
  horaInicio: string;
  horaFin: string | null;
  inicio?: string;
  fin?: string;
  precio: string;
}
