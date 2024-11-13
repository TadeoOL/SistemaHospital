export interface IRegisterArticleRequest {
  id_CuentaEspacioHospitalario: string;
  id_Almacen: string;
  articulos?: IArticleDto[];
}

export interface IArticleDto {
  id_Articulo: string;
  cantidad: number;
}
