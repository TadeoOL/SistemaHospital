import { IExistingArticleList, ISubCategory } from '../../../types/types';

export interface IArticle {
  id?: string;
  nombre: string;
  descripcion: string | null;
  // stockMinimo: string;
  // stockAlerta: string;
  unidadMedida: string;
  precioCompra: string;
  precioVentaInterno: string;
  precioVentaExterno: string;
  id_subcategoria: string;
  subCategoria: ISubCategory | string;
  stockActual?: string;
  codigoBarras?: string;
  codigoSAT?: string;
  lote?: IExistingArticleList[];
  esCaja?: boolean;
  factor?: boolean;
  unidadesPorCaja?: string;
  codigoUnidadMedida?: number;
  presentacion: string;
}
