import axios from "../libs/axios";
import {
  IAddUser,
  IArticle,
  ICategory,
  IExistingArticle,
  IProvider,
  IPurchaseConfig,
  ISubCategory,
  IUpdateUsers,
  IWarehouse,
} from "../types/types";

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
  const {
    apellidoMaterno,
    apellidoPaterno,
    email,
    id,
    nombre,
    nombreUsuario,
    roles,
    telefono,
  } = user;
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
  const {
    apellidoMaterno,
    apellidoPaterno,
    email,
    telefono,
    nombre,
    imagenURL,
  } = data;
  console.log({ imagenURL });
  const formData = new FormData();
  formData.append("Nombre", nombre);
  formData.append("ApellidoPaterno", apellidoPaterno);
  formData.append("ApellidoMaterno", apellidoMaterno);
  formData.append("Telefono", telefono);
  formData.append("Email", email);
  if (imagenURL) {
    formData.append("Imagen", imagenURL);
  }

  const res = await axios.put(`/api/Usuario/actualizar-usuario`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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

export const changeUserPassword = async (
  password: string,
  confirmPassword: string,
  actualPassword: string
) => {
  const res = await axios.put(`/api/Usuario/cambiar-contrasena`, {
    contrasena: password,
    confirmarContrasena: confirmPassword,
    contrasenaActual: actualPassword,
  });
  return res.data;
};

export const AdminChangeUsersPassword = async (
  id: string,
  password: string,
  confirmPassword: string
) => {
  const res = await axios.put(`/api/Usuario/cambiar-contrasena-administrador`, {
    id: id,
    contrasena: password,
    confirmarContrasena: confirmPassword,
  });
  return res.data;
};

export const getProviders = async (paramUrl: string) => {
  const res = await axios.get(
    `/api/Proveedor/paginacion-proveedor?${paramUrl}`
  );
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
  const res = await axios.get(
    `/api/Categoria/paginacion-categoria?${paramUrl}`
  );
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
  const { nombre, descripcion, id_categoria } = data;
  const res = await axios.post(`/api/SubCategoria/registrar-subcategoria`, {
    nombre,
    descripcion,
    id_categoria,
  });
  return res.data;
};

export const getSubCategories = async (paramUrl: string) => {
  const res = await axios.get(
    `/api/SubCategoria/paginacion-subcategoria?${paramUrl}`
  );
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
  const {
    id,
    nombre,
    descripcion,
    codigoBarras,
    id_subcategoria,
    stockAlerta,
    stockMinimo,
    unidadMedida,
  } = article;

  const res = await axios.put(`/api/Articulo/actualizar-articulo`, {
    id,
    nombre,
    descripcion,
    codigoBarras,
    stockAlerta,
    stockMinimo,
    id_subcategoria,
    unidadMedida,
  });
  return res.data;
};

export const addNewArticle = async (article: IArticle) => {
  const {
    nombre,
    descripcion,
    codigoBarras,
    id_subcategoria,
    stockAlerta,
    stockMinimo,
    unidadMedida,
    precioInventario,
  } = article;

  const res = await axios.post(`/api/Articulo/registrar-articulo`, {
    nombre,
    descripcion,
    codigoBarras,
    stockAlerta,
    stockMinimo,
    id_subcategoria,
    unidadMedida,
    precioInventario,
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
  const res = await axios.get(
    `/api/ArticuloExistente/paginacion-articulo-existente?${paramUrl}`
  );
  return res.data;
};

export const getExistingArticleById = async (existingArticleId: string) => {
  const res = await axios.get(`/api/ArticuloExistente/${existingArticleId}`);
  return res.data;
};

export const modifyExistingArticle = async (
  existingArticle: IExistingArticle
) => {
  const {
    id,
    id_almacen,
    id_articulo,
    factor,
    fechaCaducidad,
    fechaCompra,
    precioCompra,
    precioVenta,
    cantidad,
  } = existingArticle;

  const res = await axios.put(
    `/api/ArticuloExistente/actualizar-articulo-existente`,
    {
      id,
      id_almacen,
      id_articulo,
      factor,
      fechaCaducidad,
      fechaCompra,
      precioCompra,
      precioVenta,
      cantidad,
    }
  );
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
  const res = await axios.put(
    `/api/ArticuloExistente/estatus-articulo-existente`,
    { id }
  );
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

export const addNewExistingArticle = async (
  existingArticle: IExistingArticle
) => {
  const {
    id_almacen,
    id_articulo,
    factor,
    fechaCaducidad,
    fechaCompra,
    precioCompra,
    precioVenta,
    cantidad,
  } = existingArticle;

  const res = await axios.post(
    `/api/ArticuloExistente/registrar-articulo-existente`,
    {
      id_almacen,
      id_articulo,
      factor,
      fechaCaducidad,
      fechaCompra,
      precioCompra,
      precioVenta,
      cantidad,
    }
  );
  return res.data;
};

export const getArticlesByIds = async (Ids: string[]) => {
  const res = await axios.post("/api/Articulo/obtener-articulos-id", {
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
  const res = await axios.get("/api/Compras/obtener-configuracion-compras");
  return res.data as IPurchaseConfig;
};

export const addPurchaseOrder = async (
  providerId: string,
  articles: { Id_Articulo: string; CantidadComprar: number }[],
  warehouseId: string,
  totalArticlePrice: number,
  alertArticlesId: string[]
) => {
  const res = await axios.post("/api/Compras/registrar-orden-compra", {
    id_proveedor: providerId,
    Articulos: articles,
    id_almacen: warehouseId,
    PrecioTotalInventario: totalArticlePrice,
    AlertaCompras: alertArticlesId,
  });
  return res.data;
};
