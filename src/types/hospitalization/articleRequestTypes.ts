export interface IRegisterArticleRequest {
  id_CuentaEspacioHospitalario: string;
  id_Almacen: string;
  articulos?: IArticleDto[];
}

export interface IArticleDto {
  id_Articulo: string;
  cantidad: number;
}
export interface ArticlesFromRoom {
  id: string;
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  fechaCargo: string;
  nombreYFecha: string,
}

export interface IReturnArticlesRequest {
  id_CuentaEspacioHospitalario: string;
  id_Almacen: string;
  tipoDevolucion: number;
  articulos: {
    id_CuentaArticulo: string;
    id_Articulo: string;
    cantidad: number;
  }[]
}