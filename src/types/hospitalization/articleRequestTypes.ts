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
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  fechaCargo: string;
  fechaCargoUTC: string;
  nombreYFecha: string,
}

export interface IReturnArticlesRequest {
  id_CuentaEspacioHospitalario: string;
  id_Almacen: string;
  articulos: {
    id_Articulo: string;
    cantidad: number;
    fechaCreacion: string;
  }[]
}