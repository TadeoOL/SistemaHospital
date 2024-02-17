export interface IChildrenItems {
  title: string;
  path: string;
  icon: React.ReactElement;
}

export interface IModuleItems {
  title: string;
  path: string;
  childrenItems: IChildrenItems[] | [];
  icon: React.ReactElement;
}

export interface IUser {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  imagenURL: string;
  nombreUsuario: string;
  roles: string[];
  token: string;
}
export interface IUserSettings {
  imagenURL: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  roles: string[];
}

export interface IAddUser {
  contrasena: string;
  confirmarContrasena: string;
  nombreUsuario: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  imagenURL: string;
  roles: string[];
}

export interface IUpdateUsers {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  nombreUsuario: string;
  roles: string[];
  imagen?: string;
}

export interface IProvider {
  id: string;
  nombreCompania: string;
  nombreContacto: string;
  puesto: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
  rfc: string;
  nif: string;
  giroEmpresa: string;
  direccionFiscal: string;
  tipoContribuyente: number;
  urlCertificadoBP: string | null;
  urlCertificadoCR: string | null;
  urlCertificadoISO9001: string | null;
}

export interface IRequestPurchaseDrug {
  id: string;
  nombre: string;
}

export interface ICategory {
  id: string;
  nombre: string;
  descripcion: string;
}
export interface ISubCategory {
  id: string;
  nombre: string;
  descripcion: string;
  id_categoria: string;
  categoria: ICategory;
}

export interface IArticle {
  id: string;
  nombre: string;
  codigoBarras: string;
  descripcion: string;
  stockMinimo: number;
  stockAlerta: number;
  unidadMedida: string;
  precioInventario: number;
  id_subcategoria: string;
  subCategoria: ISubCategory | string;
}

export interface IExistingArticle {
  id: string;
  precioCompra: number;
  precioVenta: number;
  fechaCompra: number;
  fechaCaducidad: number;
  factor: number;
  id_articulo: string;
  id_almacen: string;
  almacen: IWarehouse;
  cantidad: number;
  articulo: IArticle;
}

export interface IWarehouse {
  id: string;
  nombre: string;
  descripcion: string;
}

export enum Status {
  cancelado = 0,
  pedido = 1,
  entregado = 2,
}
export interface IPurchase {
  id_articulo: string;
  articulo: IArticle;
  estatus: Status;
  cantidad: number;
}

export interface IPurchaseAuthorization {
  ordenCompra: string;
  fechaSolicitud: string;
  creadoPor: string;
}

export interface IArticlesAlert {
  id_Almacen: string;
  nombreAlmacen: number;
  articulos: [
    {
      id_Articulo: string;
      cantidadComprar: number;
      nombreArticulo: string;
      cantidadStock: number;
      precioInventario: number;
      unidadMedida: string;
      id_AlertaCompra: string;
    }
  ];
}

export interface IPurchaseConfig {
  cantidadOrdenDirecta: number;
  factor: IFactor[];
}

export interface IFactor {
  cantidadMinima: number;
  cantidadMaxima: number;
  factor: number;
}
