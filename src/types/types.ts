export interface IModuleItems {
  title: string;
  path: string;
  children?: IModuleItems[];
  childrenItems?: string[] | [] | undefined;
  icon: React.ReactElement;
  protectedRoles?: string[];
  mainDashboard?: string[];
  topLevel?: boolean;
  onClick?: () => void;
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
  stockMinimo: string;
  stockAlerta: string;
  unidadMedida: string;
  precioCompra: string;
  precioVenta: string;
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

export enum StatusPurchaseRequest {
  "Todas las solicitudes" = -1,
  "Cancelado" = 0,
  "Necesita autorización" = 1,
  "Necesita licitación" = 2,
  "Necesita elegir proveedor" = 3,
  "Solicitud a proveedor" = 4,
  "Selección de productos por proveedor" = 5,
  "Recibida" = 6,
  "Solicitud necesita precios" = 7,
}

export interface IPurchase {
  id_articulo: string;
  articulo: IArticle;
  estatus: StatusPurchaseRequest;
  cantidad: number;
}

export interface IPurchaseAuthorization {
  id_SolicitudCompra: string;
  usuarioSolicitado: string;
  folio: string;
  notas?: string | null;
  fechaAutorizacion?: string | null;
  estatus: number;
  fechaSolicitud: string;
  precioSolicitud: number;
  solicitudProveedor: {
    id: string;
    proveedor: { id_Proveedor: string; nombre: string };
    solicitudCompraArticulos: {
      articulo: { id_Articulo: string; nombre: string };
      id: string;
      cantidadCompra: number;
      precioProveedor: number;
    }[];
  }[];
  almacen?: { id: string; nombre: string };
  habilitado: boolean;
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
  cantidadLicitacionDirecta: number;
  activarLicitacion?: boolean;
}

export interface IFactor {
  cantidadMinima: number | string;
  cantidadMaxima: number | string;
  factorMultiplicador: number | string;
}

export interface ArticleObject {
  id_articulo: string;
  cantidadComprar: number;
  precioInventario: number;
  nombre: string;
  idAlmacen: string;
}
export interface ICheckedArticles {
  idAlmacen: string;
  idAlerta?: string;
  idArticulo: string;
}

export type SingleProvider = {
  id_Proveedor: string;
  nombre: string;
};

export type Provider = {
  id: string;
  proveedor: SingleProvider;
};

export interface IRegisterOrderPurchase {
  Id_SolicitudCompra: string;
  OrdenCompra: OrdenCompra[];
}

export interface OrdenCompra {
  Id_Proveedor: string;
  OrdenCompraArticulo: OrdenCompraArticulo[];
}

export interface OrdenCompraArticulo {
  Id_Articulo: string;
  Cantidad: number;
  precioProveedor?: number;
  nombre?: string;
}

enum ConceptPayment {
  "Contado" = 0,
  "Credito" = 1,
}

export interface IPurchaseOrder {
  id_OrdenCompra: string;
  conceptoPago: ConceptPayment;
  estatus: StatusPurchaseOrder;
  usuarioSolicitado: string;
  fechaSolicitud: string;
  folio_Extension: string;
  ordenCompraArticulo: {
    cantidad: number;
    precioProveedor: number;
    id_OrdenCompraArticulo: string;
    id_Articulo: string;
    nombre: string;
  }[];
  precioTotalOrden: number;
  proveedor: { id_Proveedor: string; nombre: string };
}

export enum StatusPurchaseOrder {
  "Todas las ordenes" = -1,
  "Orden de compra cancelada" = 0,
  "Orden de compra creada" = 1,
}

export interface IWarehouseData {
  nombre: string;
  descripcion: string;
  esSubAlmacen: boolean;
  id_AlmacenPrincipal: string | null;
  id_UsuarioEncargado: string | null;
  articuloExistentes: IExistingArticle[] | null;
  id: string;
  fechaCreacion: string;
  fechaModificacion: string;
  habilitado: boolean;
}
