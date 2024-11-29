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
  id_Categoria: string;
  nombre: string;
  descripcion: string;
  id_Almacen: string;
  almacen: string;
  subcategorias?: ISubCategory[];
}
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

export interface IArticle {
  id?: string;
  nombre: string;
  descripcion: string | null;
  // stockMinimo: string;
  // stockAlerta: string;
  unidadMedida: string;
  precioCompra: string;
  precioVentaInterno: string;
  precioVentaExterno: string;
  id_subcategoria: string;
  subCategoria: ISubCategory | string;
  stockActual?: string;
  codigoBarras?: string;
  codigoSAT?: string;
  lote?: IExistingArticleList[];
  esCaja?: boolean;
  factor?: boolean;
  unidadesPorCaja?: string;
  codigoUnidadMedida?: number;
  presentacion: string;
}

export interface IArticlePOS {
  stockActual: number;
  //cambio en id
  id_Articulo: string;
  id_ArticuloAlmacen: string;
  nombre: string;
  descripcion: string | null;
  stockMinimo: string;
  precioCompra: string;
  precioVenta: string;
  cantidad: number;
  codigoBarras?: string;
  esCaja?: boolean;
  unidadesPorCaja?: string;
  iva?: number;
}

export interface IArticleFromSearch {
  id_Articulo: string;
  nombre: string;
}

export interface IArticleFromSearchWithQuantity {
  id_Articulo: string;
  id_ArticuloAlmacen: string;
  nombre: string;
  stock: number;
  cantidad: number | null; //esta no debe venir desde el back se define en front
}
export interface IArticleFromSearchWithBarCode {
  id_Articulo: string;
  id_ArticuloCuenta: string;
  nombre: string;
  codigoBarras?: string;
  cantidad: number;
}

/*export interface IPrebuildedArticleFromArticleRequest {
  id_Articulo: string;
  id_ArticuloAlmacen?: string;
  nombre: string;
  cantidadSeleccionar: number;
  cantidad: number;
  stock: number;
}*/

export interface IExistingArticle {
  id_Articulo: string;
  cantidad: number;
  fechaCompra: string;
  precioCompra: number;
  precioVenta: number;
  precioVentaPI: number;
  stockActual: number;
  stockMinimo: number;
  fechaCaducidad: string;
  nombre: string;
  //listaArticuloExistente: IExistingArticleList[];
  codigoBarras?: string;
}
export interface IExistingArticleList {
  //Lote
  id_ArticuloExistente: string;
  id_Articulo?: string;
  id_ArticuloCuenta?: string;
  fechaCompraLote: string;
  fechaCaducidad: string;
  cantidad: number;
  //codigoBarras: string; cambioFC
}

export interface IWarehouse {
  id_Almacen: string;
  nombre: string;
  descripcion: string;
  id_UsuarioEncargado: string;
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
  factorExterno: IFactor[];
  factorInterno: IFactor[];
  cantidadLicitacionDirecta: number;
  activarLicitacion?: boolean;
}

export interface IPurchaseInternConfig {
  //cantidadOrdenDirecta: number;
  factor: IFactor[] | null;
  factorInterno: IFactor[] | null;
  //cantidadLicitacionDirecta: number;
  //activarLicitacion?: boolean;
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
  folio: string;
  id_SolicitudAlmacen: string;
  id_AlmacenOrigen: string;
  id_AlmacenDestino: string;
  tipoSolicitud: number;
  estatus: number;
  almacenOrigen: string;
  almacenDestino: string;
  usuarioSolicito?: string;
  usuarioAutorizo?: string;
  articulos: ArticleObjectInPetition[];
  fechaSolicitud: string;
}

export interface ArticleObjectInPetition {
  cantidad: number;
  nombre: string;
  id_Articulo: string;
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
  proveedor: string;
};

export interface IRegisterPurchaseOrder {
  id_Proveedor: string;
  id_Almacen: string;
  estatus: number;
  precioTotalOrden: number;
  conceptoPago: number;
  notas: string;
  cotizacionPDF: string | null;
  ordenCompraArticulo: OrdenCompraArticulo[];
}

export const PurchaseOrderEstatusTypes = {
  Cancelada: 0,
  'Necesita autorización': 1,
  'Orden de compra creada': 2,
  'Factura subida': 3,
  'Entrada a artículos completada': 4,
};

export interface OrdenCompra {
  Id_Proveedor: string;
  ConceptoPago?: number;
  OrdenCompraArticulo: OrdenCompraArticulo[];
}

export interface OrdenCompraArticulo {
  id_Articulo: string;
  cantidad: number;
  precioProveedor?: number;
  nombre?: string;
}

export interface IarticlesPrebuildedRequest {
  id_Articulo: string;
  cantidadSeleccionada: number;
  cantidadSolicitada: number;
  stock: number;
  nombre: string;
}

// enum ConceptPayment {
//   'Contado' = 0,
//   'Credito' = 1,
// }

export interface IPurchaseOrderPagination {
  id_OrdenCompra: string;
  folio_Extension: string;
  usuarioSolicitado: string;
  proveedor: string;
  total: string;
  fechaSolicitud: string;
  estatusConcepto: string;
  estatus: number;
  fueAutorizada: boolean | null;
  cotizacion: boolean;
  articulos: IPurchaseOrderArticle[] | null;
}

export interface IPurchaseOrder {
  id_OrdenCompra: string;
  id_Proveedor: any;
  folio_Extension: string;
  usuarioSolicitado: string;
  estatus: number;
  precioTotalOrden: number;
  conceptoPago: number;
  instruccionEntrega: any;
  notas: string;
  pdfCadena: string;
  id_Almacen: string;
  almacen: Almacen2;
  proveedor: Proveedor2;
  ordenCompraArticulo: OrdenCompraArticulo2[];
  fechaSolicitud: string;
  fueAutorizada: boolean;
  cotizacion: any;
}

export interface Almacen2 {
  id: string;
  nombre: string;
  descripcion: any;
  usuarioEncargado: any;
}

export interface Proveedor2 {
  id_Proveedor: string;
  nombre: string;
}

export interface OrdenCompraArticulo2 {
  id_OrdenCompraArticulo: string;
  id_Articulo: string;
  cantidad: number;
  nombre: string;
  precioProveedor: number;
  precioVenta: number;
  unidadesPorCaja: number;
  codigoBarras: any;
  unidadesTotal: number;
  fechaCaducidad?: string;
}

export interface IPurchaseOrderArticle {
  cantidad: number;
  precioProveedor: number;
  id_OrdenCompraArticulo: string;
  id_Articulo: string;
  nombre: string;
  precioVenta?: number;
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
  id_Almacen: string;
  fechaCreacion: string;
  fechaModificacion: string;
  habilitado: boolean;
  subAlmacenes: IWarehouseData[];
}
export interface IPatientFromSearch {
  id_Paciente: string;
  nombrePaciente: string;
  id_CuentaPaciente: string;
  id_IngresoPaciente: string;
}
export interface IWarehouseMovementData {
  almacenOrigen: string | null;
  almacenDestino: string | null;
  historialArticulos: IArticleHistory[] | null;
  fechaSolicitud: string;
  ingresoMotivo: string;
  salidaMotivo: string;
  id: string;
  id_CuentaPaciente?: string;
  solicitadoPor?: string;
  autorizadoPor?: string;
  estatus?: number;
  folio: string;
  infoExtra: any;
  conceptoSolicitud: string;
}

export interface IWaitingPackagesRequestData {
  id_SolicitudAlmacen: string;
  id_CuentaEspacioHospitalario: string;
  folio: string;
  paciente: string;
  quirofano: string;
  medico: string;
  horaCirugia: string;
  edadPaciente: number;
  usuarioSolicito: string;
  fechaSolicitud: string;
  estatus: number;
  articulos: IArticlesInPackageRequest[];
}

export interface IArticlesInPackageRequest {
  nombre: string;
  cantidad: number;
  id_Articulo: string;
}
export interface IArticleHistory {
  nombre: string;
  cantidad: number;
  fechaCaducidad?: string;
  Id_ArticuloEcistente?: string; //no estoy seguro si siempre llega
  id_ArticuloExistente?: string;
  id_Articulo?: string;
}

export interface IWarehousePurchaseOrder {
  id: string;
  articulo: string;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
}

export interface ISubWarehouse {
  id_Almacen: string;
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
  articulos: Articulos_contenidos[];
  id_Almacen: string;
  almacen?: string;
  id_ArticuloPaquete?: string;
}

export interface IArticlesPackageSearch {
  id_PaqueteArticulo: string;
  nombre: string;
}

export interface Articulos_contenidos {
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  precioVenta: number;
  PrecioVentaPI: number;
  lote?: IExistingArticleList[];
  cantidadSeleccion?: number;
  id_ArticuloPaquete?: string;
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
  articulos: {
    id_Articulo: string;
    cantidad: number;
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

export interface InurseRequest {
  id_SolicitudAlmacen: string;
  folio: string;
  cuarto: string;
  id_paciente: string;
  paciente: string;
  usuarioSolicitante: string;
  usuarioAutorizo: string;
  fechaSoliocitud: string; //en que piso se solicito
  estatus: number;
  tipoSolicitud: number;
  id_AlmacenSolicitado: string;
  id_CuentaEspacioHospitalario: string;
  //almacenNombre: string;
  articulos: IArticleInRequest[];
  almacen: string;
  espacioHospitalario: string;
}

export interface IArticleInRequest {
  id_Articulo: string;
  nombre: string;
  cantidad: number;
}

export interface IArticlesDelivered {
  id_Articulo: string;
  nombre: string;
  cantidad: number;
  lote: IExistingArticleList[];
}

export interface IArticlesFromPatientAcount {
  id_Articulo: string;
  id_ArticuloCuenta: string;
  nombre: string;
  cantidad: number;
  codigoBarras: string | null;
  id_CuentaPAciente: string;
  stock: number;
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
  fechaCreacion: string;
  montoPago?: number;
  nombreUsuario?: string;
  pdfCadena?: string;
}

export interface IRoom {
  id: string;
  tipoCuarto: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface IRegisterRoom {
  id: string;
  id_TipoCuarto: string;
  nombre: string;
  horaInicio: Date;
  horaFin: Date;
  provisionalId?: string;
  id_Cuarto?: string;
  precio: number;
  tipoCuarto?: number;
}

export interface IRoomsList {
  id: string;
  id_TipoCuarto: string;
  nombre: string;
  precio: number;
  tipo: number;
}

export interface IRoomEvent {
  id: string;
  id_Cuarto: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  tipoCuarto?: string;
  id_TipoCuarto?: string;
  tipo?: number;
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
  genere?: string;
  birthDate?: Date;
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
  personInChargeCity?: string;
  personInChargeState?: string;
  state?: string;
  city?: string;
  curp?: string;
}

export interface IClinicalData {
  reasonForAdmission: string;
  admissionDiagnosis: string;
  comments: string;
  allergies: string;
  bloodType: string;
}
