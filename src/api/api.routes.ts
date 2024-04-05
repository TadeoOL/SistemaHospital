import axios from '../libs/axios';
import {
  IAddSubWarehouse,
  IAddUser,
  IArticle,
  ICategory,
  IProvider,
  IPurchaseConfig,
  IRegisterOrderPurchase,
  ISubCategory,
  IUpdateUsers,
  IWarehouse,
} from '../types/types';
import { AxiosError } from 'axios';

export const login = async (userName: string, password: string) => {
  try {
    const res = await axios.post(`/api/Usuario/login`, {
      UserName: userName,
      Password: password,
    });
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const updateUserData = async (user: IUpdateUsers) => {
  const { apellidoMaterno, apellidoPaterno, email, id, nombre, nombreUsuario, roles, telefono } = user;
  const res = await axios.put(`/api/Usuario/actualizar-usuario-administrador`, {
    id: id,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    email,
    nombreUsuario,
    roles,
  });
  return res.data;
};

export const getUsers = async (paramUrl: string) => {
  try {
    const res = await axios.get(`/api/Usuario/paginacion-usuario?${paramUrl}`);
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const disableUser = async (userId: string) => {
  const res = await axios.put(`/api/Usuario/estatus-usuario`, {
    id: userId,
  });
  return res.data;
};

export const updateBasicUserInformation = async (data: {
  apellidoMaterno: string;
  apellidoPaterno: string;
  email: string;
  telefono: string;
  nombre: string;
  imagenURL?: string;
}) => {
  const { apellidoMaterno, apellidoPaterno, email, telefono, nombre, imagenURL } = data;
  const formData = new FormData();
  formData.append('Nombre', nombre);
  formData.append('ApellidoPaterno', apellidoPaterno);
  formData.append('ApellidoMaterno', apellidoMaterno);
  formData.append('Telefono', telefono);
  formData.append('Email', email);
  if (imagenURL) {
    formData.append('Imagen', imagenURL);
  }

  const res = await axios.put(`/api/Usuario/actualizar-usuario`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const registerNewUser = async (user: IAddUser) => {
  const {
    apellidoMaterno,
    apellidoPaterno,
    email,
    imagenURL,
    nombre,
    contrasena,
    roles,
    telefono,
    nombreUsuario,
    confirmarContrasena,
  } = user;
  const res = await axios.post(`/api/Usuario/registro-usuario`, {
    apellidoMaterno,
    apellidoPaterno,
    email,
    imagenURL,
    nombre,
    contrasena,
    roles,
    telefono,
    nombreUsuario,
    confirmarContrasena,
  });
  return res.data;
};

export const changeUserPassword = async (password: string, confirmPassword: string, actualPassword: string) => {
  const res = await axios.put(`/api/Usuario/cambiar-contrasena`, {
    contrasena: password,
    confirmarContrasena: confirmPassword,
    contrasenaActual: actualPassword,
  });
  return res.data;
};

export const AdminChangeUsersPassword = async (id: string, password: string, confirmPassword: string) => {
  const res = await axios.put(`/api/Usuario/cambiar-contrasena-administrador`, {
    id: id,
    contrasena: password,
    confirmarContrasena: confirmPassword,
  });
  return res.data;
};

export const getRoles = async () => {
  const res = await axios.get(`/api/Usuario/obtener-roles`);
  return res.data;
};

export const getProviders = async (paramUrl: string) => {
  const res = await axios.get(`/api/Proveedor/paginacion-proveedor?${paramUrl}`);
  return res.data;
};

export const getProviderById = async (id: string) => {
  const res = await axios.get(`/api/Proveedor/${id}`);
  return res.data;
};

export const modifyProvider = async (provider: IProvider) => {
  const {
    id,
    nombreCompania,
    nombreContacto,
    correoElectronico,
    direccion,
    direccionFiscal,
    giroEmpresa,
    nif,
    puesto,
    rfc,
    telefono,
    tipoContribuyente,
    urlCertificadoBP,
    urlCertificadoCR,
    urlCertificadoISO9001,
  } = provider;

  const res = await axios.put(`/api/Proveedor/actualizar-proveedor`, {
    id,
    nombreCompania,
    nombreContacto,
    correoElectronico,
    direccion,
    direccionFiscal,
    giroEmpresa,
    nif,
    puesto,
    rfc,
    telefono,
    tipoContribuyente,
    urlCertificadoBP,
    urlCertificadoCR,
    urlCertificadoISO9001,
  });
  return res.data;
};

export const addNewProvider = async (provider: IProvider) => {
  const {
    nombreCompania,
    nombreContacto,
    correoElectronico,
    direccion,
    direccionFiscal,
    giroEmpresa,
    nif,
    puesto,
    rfc,
    telefono,
    tipoContribuyente,
    urlCertificadoBP,
    urlCertificadoCR,
    urlCertificadoISO9001,
  } = provider;

  const res = await axios.post(`/api/Proveedor/registrar-proveedor`, {
    nombreCompania,
    nombreContacto,
    correoElectronico,
    direccion,
    direccionFiscal,
    giroEmpresa,
    nif,
    puesto,
    rfc,
    telefono,
    tipoContribuyente,
    urlCertificadoBP,
    urlCertificadoCR,
    urlCertificadoISO9001,
  });
  return res.data;
};

export const disableProvider = async (id: string) => {
  const res = await axios.put(`/api/Proveedor/estatus-proveedor`, { id });
  return res.data;
};

export const addNewCategory = async (data: ICategory) => {
  const { nombre, descripcion } = data;
  const res = await axios.post(`/api/Categoria/registrar-categoria`, {
    Nombre: nombre,
    Descripcion: descripcion,
  });
  return res.data;
};

export const getCategories = async (paramUrl: string) => {
  const res = await axios.get(`/api/Categoria/paginacion-categoria?${paramUrl}`);
  return res.data;
};

export const modifyCategory = async (category: ICategory) => {
  const { id, nombre, descripcion } = category;

  const res = await axios.put(`/api/Categoria/actualizar-categoria`, {
    id: id,
    Nombre: nombre,
    Descripcion: descripcion,
  });
  return res.data;
};

export const disableCategory = async (id: string) => {
  const res = await axios.put(`/api/Categoria/estatus-categoria`, { id });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axios.get(`/api/Categoria/obtener-categorias`);
  return res.data;
};

export const addNewSubCategory = async (data: ISubCategory) => {
  const { nombre, descripcion, id_categoria, iva } = data;
  const res = await axios.post(`/api/SubCategoria/registrar-subcategoria`, {
    nombre,
    descripcion,
    id_categoria,
    iva,
  });
  return res.data;
};

export const getSubCategories = async (paramUrl: string) => {
  const res = await axios.get(`/api/SubCategoria/paginacion-subcategoria?${paramUrl}`);
  return res.data;
};

export const disableSubCategory = async (id: string) => {
  const res = await axios.put(`/api/SubCategoria/estatus-subcategoria`, { id });
  return res.data;
};

export const modifySubCategory = async (subCategory: ISubCategory) => {
  const { id, nombre, descripcion, id_categoria } = subCategory;

  const res = await axios.put(`/api/SubCategoria/actualizar-subcategoria`, {
    id,
    nombre,
    descripcion,
    id_categoria,
  });
  return res.data;
};

export const getArticles = async (paramUrl: string) => {
  const res = await axios.get(`/api/Articulo/paginacion-articulo?${paramUrl}`);
  return res.data;
};

export const modifyArticle = async (article: IArticle) => {
  const { id, nombre, descripcion, id_subcategoria, stockAlerta, stockMinimo, unidadMedida, precioCompra } = article;

  const res = await axios.put(`/api/Articulo/actualizar-articulo`, {
    id,
    nombre,
    descripcion,
    stockAlerta,
    stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
  });
  return res.data;
};

export const addNewArticle = async (article: IArticle) => {
  const { nombre, descripcion, id_subcategoria, stockAlerta, stockMinimo, unidadMedida, precioCompra, precioVenta } =
    article;

  const res = await axios.post(`/api/Articulo/registrar-articulo`, {
    nombre,
    descripcion,
    stockAlerta,
    stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
    precioVenta,
  });
  return res.data;
};

export const getAllSubCategories = async () => {
  const res = await axios.get(`/api/SubCategoria/obtener-subcategorias`);
  return res.data;
};

export const disableArticle = async (id: string) => {
  const res = await axios.put(`/api/Articulo/estatus-articulo`, { id });
  return res.data;
};

export const getArticleById = async (articleId: string) => {
  const res = await axios.get(`/api/Articulo/${articleId}`);
  return res.data;
};

export const getExistingArticles = async (paramUrl: string) => {
  const res = await axios.get(`/api/ArticuloExistente/paginacion-articulo-existente?${paramUrl}`);
  return res.data;
};

export const getExistingArticleById = async (existingArticleId: string) => {
  const res = await axios.get(`/api/ArticuloExistente/${existingArticleId}`);
  return res.data;
};

export const getAllArticles = async () => {
  const res = await axios.get(`/api/Articulo/obtener-articulos`);
  return res.data;
};

export const getAllAlmacenes = async () => {
  const res = await axios.get(`/api/Almacen/obtener-almacenes`);
  return res.data;
};

export const disableExistingArticle = async (id: string) => {
  const res = await axios.put(`/api/ArticuloExistente/estatus-articulo-existente`, { id });
  return res.data;
};

export const getPurchaseWarehouse = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-almacen?${paramUrl}`);
  return res.data;
};

export const disablePurchaseWarehouse = async (id: string) => {
  const res = await axios.put(`/api/Almacen/estatus-almacen`, { id });
  return res.data;
};

export const getPurchaseWarehouseById = async (warehouseId: string) => {
  const res = await axios.get(`/api/Almacen/${warehouseId}`);
  return res.data;
};

export const modifyPurchaseWarehouse = async (warehouse: IWarehouse) => {
  const { id, nombre, descripcion } = warehouse;

  const res = await axios.put(`/api/Almacen/actualizar-almacen`, {
    id,
    nombre,
    descripcion,
  });
  return res.data;
};

export const addNewPurchaseWarehouse = async (data: IWarehouse) => {
  const { nombre, descripcion } = data;
  const res = await axios.post(`/api/Almacen/registrar-almacen`, {
    nombre,
    descripcion,
  });
  return res.data;
};

export const getCategoryById = async (categoryId: string) => {
  const res = await axios.get(`/api/Categoria/${categoryId}`);
  return res.data;
};

export const getSubCategoryById = async (subCategoryId: string) => {
  const res = await axios.get(`/api/SubCategoria/${subCategoryId}`);
  return res.data;
};

export const getArticlesByIds = async (Ids: string[]) => {
  const res = await axios.post('/api/Articulo/obtener-articulos-id', {
    id_articulo: Ids,
  });
  return res.data as IArticle[];
};

export const getArticlesAlert = async () => {
  const res = await axios.get(`/api/Compras/obtener-alerta-compras`);
  return res.data;
};

export const getAllProviders = async () => {
  const res = await axios.get(`/api/Proveedor/obtener-proveedores`);
  return res.data;
};

export const getPurchaseConfig = async () => {
  const res = await axios.get('/api/Compras/obtener-configuracion-compras');
  return res.data as IPurchaseConfig;
};

export const modifyPurchaseConfig = async (data: IPurchaseConfig) => {
  const { cantidadOrdenDirecta, factor, cantidadLicitacionDirecta, activarLicitacion } = data;
  const res = await axios.put('/api/Compras/actualizar-configuracion-compras', {
    factor: JSON.stringify(factor),
    cantidadOrdenDirecta,
    cantidadLicitacionDirecta,
    activarLicitacion,
  });
  const resData = {
    factor: JSON.parse(res.data.factor),
    cantidadOrdenDirecta: res.data.cantidadOrdenDirecta,
  };
  return resData as IPurchaseConfig;
};

export const addPurchaseRequest = async (data: {
  id_proveedor: string[];
  ConceptoPago: number;
  Articulos: {
    Id_Articulo: string;
    PrecioProveedor: number;
    CantidadCompra: number;
    Id_AlertaCompra?: string | null;
  }[];
  id_almacen: string;
  PrecioTotalInventario: number;
  PDFCadena?: string;
  notas?: string;
}) => {
  const res = await axios.post('/api/Compras/registrar-solicitud-compra', {
    ...data,
  });
  return res.data;
};

export const getPurchaseAuthorization = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-autorizacion-compras-administrador?${paramUrl}`);
  return res.data;
};

export const getPurchaseAuthorizationHistory = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-historial-autorizacion-administrador?${paramUrl}`);
  return res.data;
};

export const changePurchaseStatus = async (Id_SolicitudCompra: string, Estatus: number, Mensaje?: string) => {
  try {
    const res = await axios.put(`/api/Compras/estatus-solicitud-compras`, {
      Id_SolicitudCompra,
      Estatus,
      Mensaje,
    });
    return res.data;
  } catch (error) {
    console.error('Error al cambiar estado de compra:', error);
    throw error;
  }
};

export const getWaitAuthPurchase = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-autorizacion-compras?${paramUrl}`);
  return res.data;
};

export const getPurchaseOrderRequest = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-solicitud-compra?${paramUrl}`);
  return res.data;
};

export const getProviderQuotePdf = async (idQuote: string) => {
  const res = await axios.get(`/api/Compras/obtener-cotizacion-proveedor-pdf/${idQuote}`);
  return res.data;
};

export const addProviderQuote = async (Id_SolicitudProveedor: string, PDFCadena: string) => {
  const res = await axios.put(`/api/Compras/guardar-cotizacion-proveedor-pdf/`, {
    Id_SolicitudProveedor,
    PDFCadena,
  });
  return res.data;
};

export const getPurchaseOrderRequestPdf = async (idQuote: string) => {
  const res = await axios.get(`/api/Compras/obtener-solicitud-compra/${idQuote}`);
  return res.data;
};

export const deleteProviderQuote = async (idQuote: string) => {
  const res = await axios.delete(`/api/Compras/eliminar-cotizacion-proveedor-pdf/${idQuote}`);
  return res.data;
};

export const selectManyProvidersForTender = async (id_SolicitudCompra: string, id_Proveedor: string[]) => {
  const res = await axios.put(`/api/Compras/licitar-solicitud-compra`, {
    id_SolicitudCompra,
    id_Proveedor,
  });
  return res.data;
};

export const changeOrderStatus = async (Id_OrdenCompra: string, Estatus: number, Mensaje?: string) => {
  try {
    const res = await axios.put(`/api/Compras/estatus-orden-compra`, {
      Id_OrdenCompra,
      Estatus,
      Mensaje,
    });
    return res.data;
  } catch (error) {
    console.error('Error al cambiar estado de la orden:', error);
    throw error;
  }
};

export const getOrderRequest = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-orden-compra?${paramUrl}`);
  return res.data;
};

// Order Bill Response

export const addBillQuote = async (Id_OrdenCompra: string, PDFCadena: string) => {
  const res = await axios.put(`/api/Compras/guardar-factura-proveedor-pdf`, {
    Id_OrdenCompra,
    PDFCadena,
  });
  return res.data;
};

export const deleteBillQuote = async (idQuote: string) => {
  const res = await axios.delete(`/api/Compras/eliminar-factura-proveedor-pdf/${idQuote}`);
  return res.data;
};

export const getBillPdf = async (idQuote: string) => {
  const res = await axios.get(`/api/Compras/obtener-factura-proveedor-pdf/${idQuote}`);
  return res.data;
};

export const getOrderRequestById = async (idQuote: string) => {
  const res = await axios.get(`/api/Compras/obtener-orden-compra/${idQuote}`);
  return res.data;
};

// Messages Response

export const obtenerMensajes = async (modulo: string) => {
  try {
    const res = await axios.get(`/api/Sistema/Mensajes/obtener-mensajes-alerta/${modulo}`);
    return res.data;
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    throw error;
  }
};

export const crearMensaje = async (nuevoMensaje: string, module: string) => {
  try {
    await axios.post('/api/Sistema/Mensajes/crear-mensaje-alerta', {
      Mensaje: nuevoMensaje,
      Modulo: module,
    });

    const res = await axios.get(`/api/Sistema/Mensajes/obtener-mensajes-alerta/${module}`);

    return res.data;
  } catch (error) {
    console.error('Error al crear el mensaje:', error);
    throw error;
  }
};

export const eliminarMensaje = async (mensajeId: string, module: string) => {
  try {
    await axios.delete(`/api/Sistema/Mensajes/eliminar-mensaje-alerta/${mensajeId}`);

    const res = await axios.get(`/api/Sistema/Mensajes/obtener-mensajes-alerta/${module}`);

    return res.data;
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    throw error;
  }
};

export const editarMensaje = async ({
  id_Mensaje,
  mensaje,
  modulo,
}: {
  id_Mensaje: string;
  mensaje: string;
  modulo: string;
}) => {
  try {
    await axios.put(`/api/Sistema/Mensajes/modificar-mensaje-alerta`, {
      id_Mensaje,
      mensaje,
      modulo,
    });

    const res = await axios.get(`/api/Sistema/Mensajes/obtener-mensajes-alerta/${modulo}`);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      console.log(`Error al editar el mensaje. Código de estado: ${status}`);
      console.log(`Respuesta del servidor:`, data);
    } else {
      console.error('Error al editar el mensaje:', error);
    }
    throw error;
  }
};

export const addPurchaseOrder = async (data: IRegisterOrderPurchase) => {
  const { Id_SolicitudCompra, OrdenCompra } = data;
  const res = await axios.post('/api/Compras/registrar-orden-compra', {
    Id_SolicitudCompra,
    OrdenCompra,
  });
  return res.data;
};

export const getPurchaseOrder = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/paginacion-orden-compra?${paramUrl}`);
  return res.data;
};

export const getArticlesBySearch = async (paramUrl: string) => {
  const res = await axios.get(`/api/Articulo/busqueda-articulo?Search=${paramUrl}`);
  return res.data;
};

export const getCountDashboard = async () => {
  const res = await axios.get(`/api/Compras/obtener-contador-inicio`);
  return res.data;
};

export const addDirectlyPurchaseOrder = async (OrdenCompra: {
  Id_Proveedor: string;
  Id_Almacen: string;
  PrecioTotalOrden: number;
  conceptoPago: number;
  OrdenCompraArticulo: {
    Id_Articulo: string;
    Cantidad: number;
    PrecioProveedor: number;
  }[];
  notas?: string;
}) => {
  const res = await axios.post(`/api/Compras/registrar-orden-compra-directa`, {
    OrdenCompra,
  });
  return res.data;
};

export const matchArticlesWithProviders = async (SolicitudCompra: {
  Id_SolicitudCompra: string;
  SolicitudProveedores: {
    Id: string;
    Proveedor: {
      Id_Proveedor: string;
    };
    SolicitudCompraArticulos: {
      Id_Articulo: string;
      CantidadCompra: number;
      PrecioProveedor: number;
    }[];
  }[];
}) => {
  const res = await axios.post('/api/Compras/dividir-solicitud-compra', {
    SolicitudCompra,
  });
  return res.data;
};

export const getSideBardWarehouse = async () => {
  const res = await axios.get(`/api/Sistema/SideBar/obtener-almacenes`);
  return res.data;
};

export const getWarehouseById = async (warehouseId: string) => {
  const res = await axios.get(`/api/Almacen/${warehouseId}`);
  return res.data;
};

export const getWarehousePurchaseOrders = async () => {
  const res = await axios.get('https://65e5ea50d7f0758a76e7be0f.mockapi.io/api/ordenesCompra');
  return res.data;
};

export const getSubWarehouses = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-almacen?${paramUrl}`);
  return res.data;
};

export const getUsersBySearch = async (paramUrl: string) => {
  const res = await axios.get(`/api/Usuario/busqueda-usuario?Search=${paramUrl}`);
  return res.data;
};

export const addNewSubWarehouse = async (data: IAddSubWarehouse) => {
  const { Id_AlmacenPrincipal, descripcion, Id_UsuarioEncargado, esSubAlmacen, nombre } = data;
  const res = await axios.post(`/api/Almacen/registrar-almacen`, {
    Id_AlmacenPrincipal,
    descripcion,
    esSubAlmacen,
    Id_UsuarioEncargado,
    nombre,
  });
  return res;
};

export const getWareHouseMovementsById = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-historial-movimientos?${paramUrl}`);
  return res.data;
};

export const addArticlesToWarehouse = async (data: {
  id_almacen: string;
  id_ordenCompra: string;
  articulos: {
    id_articulo: string;
    cantidad: number;
    codigoBarras: string;
    fechaCaducidad: string;
  }[];
  devolucionCompras?: {
    Id_OrdenCompraArticulo: string;
    Motivo: string;
    CantidadDevuelta: string;
  }[];
}) => {
  const res = await axios.post(`/api/Compras/almacenar-articulos-orden-compra`, { ...data });
  return res.data;
};

export const getArticlesByWarehouseIdAndSearch = async (warehouseId: string, search: string) => {
  const res = await axios.get(
    `/api/ArticuloExistente/obtener-articulos-existentes?Id_Almacen=${warehouseId}&Search=${search}`
  );
  return res.data;
};

export const getPetitionsListByWareHouseId = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-peticion-articulos?${paramUrl}`);
  return res.data;
};
export const getRequestListByWareHouseId = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/paginacion-solicitud-articulos?${paramUrl}`);
  return res.data;
};


export const addMerchandiseEntry = async (merchandisePetition: {
  Id_AlmacenOrigen: string;
  Id_AlmacenDestino: string;
  ListaArticulos: string;
}) => {
  const res = await axios.post(`/api/Almacen/registrar-peticion`, {
    ...merchandisePetition,
  });
  return res.data;
};

export const modifyMinStockExistingArticle = async (data: {
  id_almacen: string;
  id_articulo: string;
  stockMinimo: string;
}) => {
  const res = await axios.put(`/api/ArticuloExistente/actualizar-articulo-existente`, {
    ...data,
  });
  return res.data;
};

export const articlesOutputToWarehouse = async (data: {
  id_almacenOrigen?: string;
  id_almacenDestino?: string;
  Articulos?: {
    Id_ArticuloExistente: string;
    Cantidad: string;
  }[];
  Estatus: number;
  Id_HistorialMovimiento?: string;
}) => {
  const res = await axios.post(`/api/Almacen/salida-articulo-almacen`, {
    ...data,
  });
  return res.data;
};
