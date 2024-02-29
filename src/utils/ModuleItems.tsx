import { IModuleItems } from "../types/types";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArticleIcon from "@mui/icons-material/Article";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RuleIcon from "@mui/icons-material/Rule";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const ModuleItems: IModuleItems[] = [
  {
    title: "Inicio",
    path: "/",
    icon: <DashboardIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Solicitud de compras",
    path: "/compras/solicitud-compras",
    icon: <AddShoppingCartIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Categorías y subcategorias",
    path: "/compras/categorias",
    icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
  },
  {
    title: "Artículos",
    path: "/compras/articulos",
    icon: <ArticleIcon sx={{ color: "#fff" }} />,
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
];
