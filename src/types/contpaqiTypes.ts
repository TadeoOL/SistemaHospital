export interface DocumentConcept {
  cidconceptodocumento: number;
  ccodigoconcepto?: string;
  cnombreconcepto: string;
  ciddocumentode: number;
  cnofolio: number;
}

export interface SizeUnit {
  id_UnidadMedida: number;
  nombre: string;
}

export enum ProductType {
  ARTICULO = 1,
  SERVICIO = 2,
  TIPO_CUARTO = 3,
  TIPO_QUIROFANO = 4,
  TIPO_QUIROFANO_RECUPERACION = 5,
}

export const productTypeLabel = {
  [ProductType.ARTICULO]: 'Artículo',
  [ProductType.SERVICIO]: 'Servicio',
  [ProductType.TIPO_CUARTO]: 'Tipo de cuarto',
  [ProductType.TIPO_QUIROFANO]: 'Tipo de quirófano',
  [ProductType.TIPO_QUIROFANO_RECUPERACION]: 'Tipo de quirófano de recuperación',
} as const;
