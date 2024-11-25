import { ISubCategory } from '@/types/types';

export interface ICategory {
  id_Categoria: string;
  nombre: string;
  descripcion: string;
  id_Almacen: string;
  almacen: string;
  subcategorias?: ISubCategory[];
}
