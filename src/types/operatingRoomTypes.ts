export interface IOperatingRoomConfig {
  configuracionQuirofano: IRecoveryRoomOperatingRoom[];
  configuracionRecuperacion: IRecoveryRoomOperatingRoom[];
}

export interface IRecoveryRoomOperatingRoom {
  inicio: string;
  fin: string | null;
  precio: string;
}
