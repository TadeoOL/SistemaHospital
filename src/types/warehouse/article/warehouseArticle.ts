export interface IWarehouseArticle {
  id_Articulo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  informacionLotes: any[]
}
