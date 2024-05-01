export interface IModuleItems {
  title: string;
  path: string;
  children?: IModuleItems[];
  childrenItems?: string[] | [] | undefined;
  icon: React.ReactElement | null;
  protectedRoles?: string[];
  mainDashboard?: string[];
  topLevel?: boolean;
  onClick?: () => void;
}

export interface IModuleItemsList {
  categoryTitle: string;
  moduleItems: IModuleItems[];
  icon?: React.ReactElement;
  id?: string;
  path?: string;
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
  id_Almacen: string;
  almacen: string;
}
export interface ISubCategory {
  id: string;
  nombre: string;
  descripcion: string;
  id_categoria: string;
  iva: string;
  categoria: ICategory;
}

export interface IArticle {
  id: string;
  nombre: string;
  descripcion: string | null;
  stockMinimo: string;
  stockAlerta: string;
  unidadMedida: string;
  precioCompra: string;
  precioVenta: string;
  id_subcategoria: string;
  subCategoria: ISubCategory | string;
  stockActual?: string;
  lote?: IExistingArticleList[];
}

export interface IExistingArticle {
  id: string;
  cantidad: number;
  fechaCompra: string;
  precioCompra: number;
  precioVenta: number;
  factorAplicado: number;
  stockActual: number;
  stockMinimo: number;
  fechaCaducidad: string;
  nombre: string;
  listaArticuloExistente: IExistingArticleList[];
}

export interface IExistingArticleList {
  id: string;
  fechaCompraLote: string;
  fechaCaducidad: string;
  cantidad: number;
  codigoBarras: string;
}

export interface IWarehouse {
  id: string;
  nombre: string;
  descripcion: string;
}

export enum StatusPurchaseRequest {
  'Todas las solicitudes' = -1,
  'Cancelado' = 0,
  'Necesita autorización' = 1,
  'Necesita licitación' = 2,
  'Necesita elegir proveedor' = 3,
  'Solicitud a proveedor' = 4,
  'Selección de productos por proveedor' = 5,
  'Recibida' = 6,
  'Solicitud necesita precios' = 7,
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
    pdfBase64?: string;
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
    },
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

export interface MerchandiseEntry {
  id: string;
  id_AlmacenOrigen: string;
  id_AlmacenDestino: string;
  almacenOrigen: string;
  almacenDestino: string;
  historialArticulos: ArticleObjectInPetition[];
  fechaSolicitud: string;
  estatus: number;
  solicitadoPor?: string;
  autorizadoPor?: string;
  folio: string;
}

export interface ArticleObjectInPetition {
  cantidad: number;
  nombre: string;
}

export interface ICheckedArticles {
  idAlmacen: string;
  idAlerta?: string;
  idArticulo: string;
}

export type SingleProvider = {
  id_Proveedor: string;
  nombre: string;
  estatus?: number;
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
  ConceptoPago?: number;
  OrdenCompraArticulo: OrdenCompraArticulo[];
}

export interface OrdenCompraArticulo {
  Id_Articulo: string;
  Cantidad: number;
  precioProveedor?: number;
  nombre?: string;
}

enum ConceptPayment {
  'Contado' = 0,
  'Credito' = 1,
}

export interface IPurchaseOrder {
  id_OrdenCompra: string;
  conceptoPago: ConceptPayment;
  estatus: StatusPurchaseOrder;
  usuarioSolicitado: string;
  fechaSolicitud: string;
  folio_Extension: string;
  ordenCompraArticulo: IPurchaseOrderArticle[];
  precioTotalOrden: number;
  proveedor: { id_Proveedor: string; nombre: string; estatus?: number | null };
  id_Almacen: string;
  fueAutorizada: boolean;
  notas?: string;
}

export interface IPurchaseOrderArticle {
  cantidad: number;
  precioProveedor: number;
  id_OrdenCompraArticulo: string;
  id_Articulo: string;
  nombre: string;
  precioVenta?: number;
  factorAplicado?: number;
  codigoBarras?: string;
  fechaCaducidad?: string;
}

export enum StatusPurchaseOrder {
  'Todas las ordenes' = -1,
  'Cancelada' = 0,
  'En espera de Factura' = 1,
  'Se necesita entrada de artículos' = 2,
  'Ingresado a inventario' = 3,
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
  subAlmacenes: IWarehouseData[];
}
export interface IWarehouseMovementData {
  almacenOrigen: string | null;
  almacenDestino: string | null;
  historialArticulos: IArticleHistory[] | null;
  fechaSolicitud: string;
  ingresoMotivo: string;
  salidaMotivo: string;
  id: string;
  solicitadoPor?: string;
  autorizadoPor?: string;
  estatus?: number;
  folio: string;
}
export interface IArticleHistory {
  nombre: string;
  cantidad: number;
}

export interface IWarehousePurchaseOrder {
  id: string;
  articulo: string;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
  factorAplicado: number;
}

export interface ISubWarehouse {
  id: string;
  nombre: string;
  descripcion: string;
  usuarioEncargado: string;
}

export interface IAddSubWarehouse {
  nombre: string;
  descripcion: string;
  esSubAlmacen: boolean;
  Id_AlmacenPrincipal: string;
  Id_UsuarioEncargado: string;
}

export interface ISideBarWarehouse {
  id: string;
  nombre: string;
  subAlmacenes: { id: string; nombre: string }[];
}

export interface IArticlesPackage {
  id_PaqueteArticulo: string;
  nombre: string;
  descripcion?: string;
  contenido: Articulos_contenidos[];
  id_Almacen: string;
  almacen?: string;
}
export interface Articulos_contenidos {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface IPosArticle {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  codigoBarras: string;
  precio: number;
  iva: number;
  fechaCaducidad: string;
}

export interface IRegisterSale {
  id_Caja: string;
  tipoPago: number;
  montoPago: number;
  totalVenta: number;
  articulos: {
    id: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}

export interface IUserSalesRegister {
  id: string;
  dineroAlCorte: number | null;
  diaHoraCorte: string | null;
  fechaCreacion: string;
  cerrada: boolean;
  pasoSuJornada: boolean;
  tieneCaja: boolean;
}

export interface ISell {
  id: string;
  id_Caja: string;
  totalVenta: number;
  montoPago: number;
  estadoVenta: number;
  tipoPago: number;
  folio: string;
  articulosVendidos: IArticleSell[];
}

export interface IArticleSell {
  id: string;
  cantidad: number;
  precioUnitario: number;
  nombre: string;
}

export interface IPharmacyConfig {
  id_Almacen: string;
}

export interface IPurchaseWithoutProvider {
  articulos: {
    id_Articulo: string;
    cantidadCompra: number;
  }[];
  notas: string;
}
