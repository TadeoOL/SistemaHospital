import { IModuleItems } from "../types/types";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArticleIcon from "@mui/icons-material/Article";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RuleIcon from "@mui/icons-material/Rule";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

export const ModuleItems: IModuleItems[] = [
  {
    title: "Inicio",
    path: "/",
    icon: <DashboardIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Compras",
    path: "/compras/solicitud-compras/ordenes-compra",
    icon: <AddShoppingCartIcon sx={{ color: "#fff" }} />,
    childrenItems: [
      "ordenes-compra",
      "productos-stock-bajo",
      "productos-solicitados-orden-compra",
      "productos-espera-autorizacion",
    ],
  },
  {
    title: "Categorías",
    path: "/compras/categorias/categoria",
    icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
    childrenItems: ["categoria", "subcategoria"],
  },
  {
    title: "Artículos",
    path: "/compras/articulos/articulo",
    icon: <ArticleIcon sx={{ color: "#fff" }} />,
    childrenItems: ["articulo", "articulo-existente"],
  },
  {
    title: "Almacén",
    path: "/compras/almacen",
    icon: <WarehouseIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Autorizaciones",
    path: "/compras/autorizacion-compras",
    icon: <RuleIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Proveedores",
    path: "/compras/proveedores",
    icon: <PermContactCalendarIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Configuración",
    path: "/compras/configuracion-compras",
    icon: <SettingsIcon sx={{ color: "#fff" }} />,
  },
];
