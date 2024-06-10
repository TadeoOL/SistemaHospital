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
  codigoBarras?: string;
  lote?: IExistingArticleList[];
  esCaja?: boolean;
  unidadesPorCaja?: string;
}

export interface IArticle2 {
  //cambio en id
  id_Articulo: string;
  nombre: string;
  descripcion: string | null;
  stockMinimo: string;
  precioCompra: string;
  precioVenta: string;
  stockActual?: string;
  codigoBarras?: string;
  lote?: IExistingArticleList[];
  listaArticuloExistente: IExistingArticleList[];
  esCaja?: boolean;
  unidadesPorCaja?: string;
  cantidad?: number;
  iva?: number;
}

export interface IArticleFromSearch {
  id_Articulo: string;
  nombre: string;
}

export interface IExistingArticle {
  id_Articulo: string;
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
  codigoBarras?: string;
}

export interface IExistingArticleList {
  //Lote
  id_ArticuloExistente: string;
  fechaCompraLote: string;
  fechaCaducidad: string;
  cantidad: number;
  //codigoBarras: string; cambioFC
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
  fechaCaducidad: string | null;
  id_Articulo: string;
  lote?: IExistingArticleList;
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
  cotizacion?: string;
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
  unidadesPorCaja?: number;
  unidadesTotal?: number;
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
  fechaCaducidad?: string;
  Id_ArticuloEcistente?: string;//no estoy seguro si siempre llega
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
  lote?: IExistingArticleList[];
  cantidadSeleccion?: number;
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

export interface ICheckoutHistory {
  id: string;
  nombreUsuario: string;
  efectivo: number;
  transferencia: number;
  debito: number;
  credito: number;
  ventaTotal: number;
  diaCorte: string;
}

export interface ICheckoutCloseHistory {
  id_CajaPrincipal: string;
  nombreUsuario: string;
  efectivo: number;
  transferencia: number;
  debito: number;
  credito: number;
  ventaTotal: number;
  diaHoraCorte: string;
  dineroAlCorte: number;
  dineroInicial: number;
}

export interface ICheckoutSell {
  id_VentaPrincipal: string;
  folio: string;
  moduloProveniente: string;
  paciente: string;
  totalVenta: number;
  tipoPago: number;
  estatus: number;
  id_UsuarioPase: string;
  notas?: string;
  montoPago?: number;
  nombreUsuario?: string;
  pdfCadena?: string;
}

export interface IConfigEmitterUsers {
  id_Usuario: string;
  nombre: string;
  departamento: string[];
}

export interface IRoom {
  id: string;
  tipoCuarto: string;
  nombre: string;
  descripcion: string;
}

export interface ISurgeryProcedure {
  id: string;
  nombre: string;
  duracionHospitalizacion: number;
  precioCirujia: number;
  duracionCirujia: string;
  descripcion: string;
}

export interface IRegisterRoom {
  id: string;
  tipoCuarto: string;
  nombre: string;
  horaInicio: Date;
  horaFin: Date;
  provisionalId?: string;
  id_Cuarto?: string;
}

export interface IRoomsList {
  id: string;
  tipoCuarto: string;
  nombre: string;
}

export interface IRoomEvent {
  id: string;
  id_Cuarto: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}
export interface IEventsCalendar {
  id: string;
  roomId: string;
  title: string;
  start: Date;
  end: Date;
  source?: string;
}

export interface IPatient {
  name: string;
  lastName: string;
  secondLastName: string;
  age: string;
  genere: string;
  birthDate: Date;
  civilStatus?: string;
  phoneNumber?: string;
  occupation?: string;
  zipCode?: string;
  neighborhood?: string;
  address?: string;
  personInCharge?: string;
  relationship?: string;
  personInChargeZipCode?: string;
  personInChargeNeighborhood?: string;
  personInChargeAddress?: string;
  personInChargePhoneNumber?: string;
}

export interface IClinicalData {
  medicName: string;
  specialty: string;
  reasonForAdmission: string;
  admissionDiagnosis: string;
  procedure?: string;
  comments: string;
  allergies: string;
  bloodType: string;
}
