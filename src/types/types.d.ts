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
  categoryId: string;
}

export interface IArticle {
  id: string;
  nombre: string;
  codigoBarras: string;
  descripcion: string;
  stockMinimo: number;
  stockAlerta: number;
  unidadMedida: string;
  id_subcategoria: string;
  subCategoria: ISubCategory;
}

export interface IExistingArticle {
  id: string;
  nombre: string;
}

export interface IAlmacen {
  id: string;
  nombre: string;
  descripcion: string;
}
