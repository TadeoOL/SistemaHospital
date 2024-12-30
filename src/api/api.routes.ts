import axios from '../libs/axios';
import {
  IAddSubWarehouse,
  IAddUser,
  IArticle,
  IArticlesPackage,
  IarticlesPrebuildedRequest,
  ICategory,
  IProvider,
  IPurchaseConfig,
  IRegisterPurchaseOrder,
  ISubCategory,
  IUpdateUsers,
  IWarehouse,
  IWarehouseData,
  OrdenCompraArticulo,
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
  const res = await axios.get(`/api/Compras/Catalogo/Proveedor/paginacion-proveedor?${paramUrl}`);
  return res.data;
};

export const getProviderById = async (id: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Proveedor/${id}`);
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

  const res = await axios.put(`/api/Compras/Catalogo/Proveedor/actualizar-proveedor`, {
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

  const res = await axios.post(`/api/Compras/Catalogo/Proveedor/registrar-proveedor`, {
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
  const res = await axios.put(`/api/Compras/Catalogo/Proveedor/estatus-proveedor`, { id });
  return res.data;
};

export const addNewCategory = async (data: ICategory) => {
  const { nombre, descripcion, id_Almacen } = data;
  const res = await axios.post(`/api/Compras/Catalogo/Categoria/registrar-categoria`, {
    Nombre: nombre,
    Descripcion: descripcion,
    id_Almacen: id_Almacen,
  });
  return res.data;
};

export const getCategories = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Categoria/paginacion-categoria?${paramUrl}`);
  return res.data;
};

export const modifyCategory = async (category: ICategory) => {
  const { id_Categoria, nombre, descripcion, id_Almacen } = category;

  const res = await axios.put(`/api/Compras/Catalogo/Categoria/actualizar-categoria`, {
    id: id_Categoria,
    Nombre: nombre,
    Descripcion: descripcion,
    id_Almacen: id_Almacen,
  });
  return res.data;
};

export const disableCategory = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/Categoria/estatus-categoria`, { id });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axios.get(`/api/Compras/Catalogo/Categoria/obtener-categorias`);
  return res.data;
};

export const getAllCategoriesByWarehouse = async (Id_Warehouse: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Categoria/obtener-categorias?Id_Almacen=${Id_Warehouse}`);
  return res.data;
};

export const addNewSubCategory = async (data: ISubCategory) => {
  const { nombre, descripcion, id_categoria, iva } = data;
  const res = await axios.post(`/api/Compras/Catalogo/SubCategoria/registrar-subcategoria`, {
    nombre,
    descripcion,
    id_categoria,
    iva,
  });
  return res.data;
};

export const getSubCategories = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/SubCategoria/paginacion-subcategoria?${paramUrl}`);
  return res.data;
};

export const disableSubCategory = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/SubCategoria/estatus-subcategoria`, { id });
  return res.data;
};

export const modifySubCategory = async (subCategory: ISubCategory) => {
  const { id_SubCategoria, nombre, descripcion, id_categoria, iva } = subCategory;
  const res = await axios.put(`/api/Compras/Catalogo/SubCategoria/actualizar-subcategoria`, {
    id: id_SubCategoria,
    nombre,
    descripcion,
    iva,
    id_categoria,
  });

  return res.data;
};

export const getArticles = async (paramUrl: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Articulo/paginacion-articulo?${paramUrl}`);
  return res.data;
};

export const modifyArticle = async (article: IArticle) => {
  const {
    id,
    nombre,
    descripcion,
    id_subcategoria,
    // stockAlerta,
    // stockMinimo,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    presentacion,
  } = article;

  const res = await axios.put(`/api/Compras/Catalogo/Articulo/actualizar-articulo`, {
    id,
    nombre,
    descripcion,
    // stockAlerta,
    // stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    presentacion,
  });
  return res.data;
};

export const addNewArticle = async (article: IArticle) => {
  const {
    nombre,
    descripcion,
    id_subcategoria,
    // stockAlerta,
    // stockMinimo,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    codigoUnidadMedida,
    presentacion,
  } = article;

  const res = await axios.post(`/api/Compras/Catalogo/Articulo/registrar-articulo`, {
    nombre,
    descripcion,
    // stockAlerta,
    // stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioCompra,
    precioVentaExterno,
    precioVentaInterno,
    esCaja,
    unidadesPorCaja,
    codigoBarras,
    codigoSAT,
    codigoUnidadMedida,
    presentacion,
  });
  return res.data;
};

export const getAllSubCategories = async () => {
  const res = await axios.get(`/api/Compras/Catalogo/SubCategoria/obtener-subcategorias`);
  return res.data;
};

export const disableArticle = async (id: string) => {
  const res = await axios.put(`/api/Compras/Catalogo/Articulo/estatus-articulo`, { id });
  return res.data;
};

export const getArticleById = async (articleId: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Articulo/${articleId}`);
  return res.data;
};

//barra kill
/*export const getExistingArticles = async (paramUrl: string) => {
  const res = await axios.get(`/api/ArticuloExistente/paginacion-articulo-existente?${paramUrl}`);
  return res.data;
};*/
export const getExistingArticles = async (paramUrl: string) => {
  const res = await axios.get(`/api/AlmacenArticulo/paginacion-almacen-articulo?${paramUrl}`);
  return res.data;
};

//paginacion-almacen-articulo

export const getExistingArticleById = async (existingArticleId: string) => {
  const res = await axios.get(`/api/ArticuloExistente/${existingArticleId}`);
  return res.data;
};

export const getAllArticles = async () => {
  const res = await axios.get(`/api/Articulo/obtener-articulos`);
  return res.data;
};

export const getArticlesFromWarehouseSearch = async (search: string, idWarehouse: string) => {
  const res = await axios.get(
    `/api/AlmacenArticulo/obtener-almacen-articulos?search=${search}&id_Almacen=${idWarehouse}`
  );
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

export const disableWarehouseById = async (id: string) => {
  const res = await axios.put(`/api/Almacen/estatus-almacen`, { id });
  return res.data;
};

export const getPurchaseWarehouseById = async (warehouseId: string) => {
  const res = await axios.get(`/api/Almacen/${warehouseId}`);
  return res.data;
};

export const modifyWarehouseById = async (warehouse: {
  Id_AlmacenPrincipal: string;
  Id_UsuarioEncargado?: string;
  descripcion: string;
  nombre: string;
}) => {
  const { Id_AlmacenPrincipal, Id_UsuarioEncargado, descripcion, nombre } = warehouse;
  const res = await axios.put(`/api/Almacen/actualizar-almacen`, {
    id: Id_AlmacenPrincipal,
    Id_UsuarioEncargado,
    descripcion,
    nombre,
  });
  return res.data;
};

export const addNewPurchaseWarehouse = async (data: IWarehouse) => {
  const { nombre, descripcion, id_UsuarioEncargado } = data;
  const res = await axios.post(`/api/Almacen/registrar-almacen`, {
    nombre,
    descripcion,
    id_UsuarioEncargado,
  });
  return res.data;
};

export const getCategoryById = async (categoryId: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/Categoria/${categoryId}`);
  console.log(res.data);
  return res.data;
};

export const getSubCategoryById = async (subCategoryId: string) => {
  const res = await axios.get(`/api/Compras/Catalogo/SubCategoria/${subCategoryId}`);
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
  const res = await axios.get(`/api/Compras/Catalogo/Proveedor/obtener-proveedores`);
  return res.data;
};

export const getPurchaseConfig = async () => {
  const res = await axios.get('/api/Sistema/obtener-configuracion/Compras');
  return res.data as IPurchaseConfig;
};

export const modifyModuleConfig = async (config: any, module: string) => {
  const object = {
    modulo: module,
    configuracion: JSON.stringify(config),
  };
  const res = await axios.put('/api/Sistema/actualizar-configuracion-modulo', object);
  return res.data;
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

export const addBillQuote = async (Id_OrdenCompra: string, PDF: string, tipoPDF: number) => {
  const res = await axios.put(`/api/Compras/guardar-pdf-orden-compra`, {
    Id_OrdenCompra,
    PDF,
    tipoPDF,
  });
  return res.data;
};

export const getBillPdf = async (idQuote: string) => {
  const res = await axios.get(`/api/Compras/obtener-factura-orden-compra/${idQuote}`);
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

export const addPurchaseOrder = async (data: IRegisterPurchaseOrder) => {
  const res = await axios.post('/api/Compras/registrar-orden-compra', data);
  return res.data;
};

export const getArticlesBySearch = async (paramUrl: string, warehouseSelected?: string) => {
  const res = await axios.get(
    `/api/Compras/Catalogo/Articulo/obtener-articulos?Search=${paramUrl}&Id_Almacen=${warehouseSelected || ''}`
  );
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
  return res.data as IWarehouseData;
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
  id_ordenCompra: string | null;
  articulos: {
    id_articulo: string;
    cantidad: number;
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

export const registrarNuevoLote = async (data: {
  id_almacen: string;
  id_articulo: string;
  cantidad: number;
  fechaCaducidad: string;
}) => {
  const res = await axios.post(`/api/ArticuloExistente/registrar-articulo-existente`, { ...data });
  return res.data;
};

export const getArticlesByWarehouseIdAndSearch = async (warehouseId: string, search: string) => {
  const res = await axios.get(
    `/api/ArticuloExistente/obtener-articulos-existentes?Id_Almacen=${warehouseId}&Search=${search}`
  );
  return res.data;
};

export const getPetitionsListByWareHouseId = async (paramUrl: string) => {
  const res = await axios.get(`/api/SolicitudAlmacen/paginacion-solicitud-almacen?${paramUrl}`);
  return res.data;
};
export const getRequestListByWareHouseId = async (paramUrl: string) => {
  const res = await axios.get(`/api/SolicitudAlmacen/paginacion-solicitud-almacen?${paramUrl}`);
  return res.data;
};

export const addMerchandiseEntry = async (merchandisePetition: {
  Id_AlmacenOrigen: string;
  Id_AlmacenDestino: string;
  Articulos: any;
}) => {
  const res = await axios.post(`/api/SolicitudAlmacen/registrar-solicitud-almacen`, {
    ...merchandisePetition,
  });
  return res.data;
};

export const modifyMinStockExistingArticle = async (data: {
  id_Almacen: string;
  id_Articulo: string;
  stockMinimo: string;
  stock: number;
}) => {
  const res = await axios.put(`/api/AlmacenArticulo/ajuste-inventario-almacen-articulo`, {
    ...data,
  });
  return res.data;
};

export const articlesOutputToWarehouse = async (data: {
  Articulos?: {
    Id_Articulo: string;
    Nombre: string;
    Cantidad: number;
  }[];
  Estatus: number;
  Motivo?: string;
  Id_SolicitudAlmacen: string;
}) => {
  const res = await axios.put(`/api/SolicitudAlmacen/estatus-peticion-almacen`, {
    ...data,
  });
  return res.data;
};

export const waitingpackageChangeStatus = async (data: {
  Estatus: number;
  Id_HistorialMovimiento: string;
  Lotes?: any;
}) => {
  const res = await axios.put(`/api/Almacen/estatus-espera-paquete`, {
    ...data,
  });
  return res.data;
};

/*export const getQurirgicalPackage = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/obtener-paquetes-quirurgicos?&${paramUrl}`);
  return res.data;
};*/

export const getPackagesNamesByWarehouseIdAndSearch = async (paramUrl: string) => {
  const res = await axios.get(`/api/Almacen/obtener-paquetes-nombres?&${paramUrl}`);
  return res.data;
};

export const getPackagesByWarehouseId = async (id: string) => {
  const res = await axios.get(`/api/Almacen/obtener-paquetes?Id=${id}`);
  return res.data;
};

export const getPackageById = async (packageId: string) => {
  const res = await axios.get(`/api/Almacen/paquete-articulo?Id=${packageId}`);
  return res.data as IArticlesPackage;
};

export const modifyPackage = async (data: {
  Id: string;
  ListaArticulosPorBorrar?: {
    Id_ArticuloPaquete: string;
  }[];
  ListaArticulosPorEditar?: {
    Id_ArticuloPaquete?: string;
    Cantidad: number;
  }[];
  ListaArticulosPorAgregar?: {
    Cantidad: number;
    Id_Articulo: string;
  }[];
  Nombre: string;
  Descripcion: string;
  Id_Almacen: string;
}) => {
  console.log('data:', data);
  const res = await axios.put(`/api/Quirofano/Catalogo/PaqueteQuirurgico/actualizar-paquete-quirurgico`, {
    ...data,
  });
  return res.data;
};

export const disablePackage = async (data: { id: string }) => {
  const res = await axios.put(`/api/Almacen/estatus-paquete`, {
    ...data,
  });
  return res.data;
};

export const articlesPackageOutputToWarehouse = async (data: { Estatus: number; Id_HistorialMovimiento?: string }) => {
  const res = await axios.put(`/api/Almacen/modificar-estatus-paquete`, {
    ...data,
  });
  return res.data;
};

export const modifyOrderPurcharse = async (data: {
  Id_OrdenCompra: string;
  Id_Proveedor: string;
  id_Almacen: string;
  conceptoPago?: number;
  notas: string;
  OrdenCompraArticulo: OrdenCompraArticulo[];
}) => {
  const res = await axios.put(`/api/Compras/modificar-orden-compra`, data);
  return res.data;
};

export const getNursesUsers = async (search?: string) => {
  const res = await axios.get(`/api/Usuario/busqueda-usuario-enfermeros?search=${search ? search : ''}`);
  return res.data;
};

export const patientArticlesManagement = async (data: {
  Id_Almacen: string;
  ArticulosPorEntrar?: {
    //se devuelven a la cuenta
    Id_Articulo: string;
    Id_ArticuloCuenta: string;
    Cantidad: number;
  }[];
  ArticulosPorSalir?: {
    // se cargan a la cuenta
    Id_Articulo: string;
    Nombre: string;
    Cantidad: number;
  }[];
  IngresoMotivo: string;
  NombreEnfermero?: string;
  Id_CuentaPaciente: string;
  SolicitadoEn: number; // 1 farmacia/2 Quirofano
}) => {
  const res = await axios.put(`/api/ArticuloExistente/entrada-manual-lote`, {
    ...data,
  });
  return res.data;
};

export const articlesEntryToWarehouse = async (data: {
  Id_Almacen: string;
  ArticulosPorEntrar?: {
    //se devuelven a la cuenta
    Id_Articulo: string;
    Id_ArticuloCuenta: string;
    Cantidad: number;
  }[];
  ArticulosPorSalir?: {
    // se cargan a la cuenta
    Id_Articulo: string;
    Nombre: string;
    Cantidad: number;
  }[];
  IngresoMotivo: string;
  NombreEnfermero?: string;
  Id_CuentaPaciente: string;
  SolicitadoEn: number; // 1 farmacia/2 Quirofano
}) => {
  const res = await axios.put(`/api/ArticuloExistente/entrada-manual-lote`, {
    ...data,
  });
  return res.data;
};

export const articlesLoteUpdate = async (data: {
  Id_Almacen: string;
  Id_Articulo: string;
  Id_Articulo_Lote: string;
  Stock?: number;
  CodigoBarras?: string;
  FechaCaducidad?: string;
}) => {
  const res = await axios.put(`/api/ArticuloExistente/actualizar-lote-existente`, {
    ...data,
  });
  return res.data;
};
export const articlesLoteDelete = async (data: { Id_ArticuloExistente: string }) => {
  const res = await axios.put(`/api/ArticuloExistente/inhabilitar-lote-existente`, {
    ...data,
  });
  return res.data;
};

export const getAmountForArticleInWarehouse = async (id_Articulo: string, Id_Almacen: string) => {
  const res = await axios.get(
    `/api/AlmacenArticulo/obtener-stock-articulo?Id_Articulo=${id_Articulo}&Id_Almacen=${Id_Almacen}`
  );
  return res.data;
};

//SolicitudEnfemero

export const addNurseRequest = async (article: any) => {
  const { Cuarto, Id_Paciente, Id_CuentaPaciente, SolicitadoEn, Id_AlmacenSolicitado, ListaSolicitud } = article;

  const res = await axios.post(`/api/SolicitudEnfemero/registrar-solicitud-enfermero`, {
    Cuarto,
    Id_Paciente,
    Id_CuentaPaciente,
    SolicitadoEn,
    Id_AlmacenSolicitado,
    ListaSolicitud,
  });
  return res.data;
};

export const updateStatusNurseRequest = async (data: {
  Id: string;
  EstadoSolicitud: number;
  Id_AlmacenOrigen: string;
  Id_CuentaPaciente?: string;
  Id_Enfermero?: string;
  Lotes?: any;
}) => {
  const res = await axios.put(`/api/SolicitudEnfemero/cambiar-estatus-solicitud-enfermero`, {
    ...data,
  });
  return res.data;
};

export const buildPackage = async (data: {
  id_SolicitudAlmacen: string;
  id_CuentaEspacioHospitalario: string;
  articulos?: { Id_Articulo: string; Cantidad: number }[];
  idsArticulosEliminar?: string[];
  estatus: number;
  motivo?: string;
}) => {
  const res = await axios.put(`/api/SalidasExistencias/estatus-solicitud-paciente`, data);
  return res.data;
};

export const getPackagePreBuilded = async (paramUrl: string) => {
  const res = await axios.get(`/api/SalidasExistencias/armar-solicitud-espera/${paramUrl}`);
  return res.data as IarticlesPrebuildedRequest[];
};

export const getNurseRequestPreBuilded = async (id_solicitud: string, id_Almacen: string) => {
  const res = await axios.get(
    `/api/SolicitudEnfemero/prearmado-solicitud-enfermero?Id_SolicitudEnfermero=${id_solicitud}&Id_Almacen=${id_Almacen}`
  );
  return res.data.articulosSolicitados;
};
