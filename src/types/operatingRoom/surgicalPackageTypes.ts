export interface ISurgicalPackage {
  id_PaqueteQuirurgico: string;
  nombre?: string;
  descripcion?: string;
  articulos?: ISurgicalPackageItem[];
}

export interface ISurgicalPackageItem {
  id_Articulo: string;
  nombre?: string;
  cantidad: number;
}
