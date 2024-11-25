export interface ISubCategory {
  id?: string;
  id_SubCategoria: string;
  nombre: string;
  descripcion: string;
  id_categoria: string;
  iva: boolean;
  categoria?: {
    id_Categoria: string;
    nombre: string;
    descripcion: string;
    almacen: any;
    id_Almacen: string;
  };
}
