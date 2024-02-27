import { IModuleItems } from "../types/types";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import StoreIcon from "@mui/icons-material/Store";
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
    icon: <DashboardIcon />,
  },
  {
    title: "Cátalogos",
    path: "/compras",
    childrenItems: [
      {
        title: "Solicitud de compras",
        path: "/compras/solicitud-compras",
        icon: <AddShoppingCartIcon />,
      },
      {
        title: "Categorías y subcategorias",
        path: "/compras/categorias",
        icon: <FormatListBulletedIcon />,
      },
      {
        title: "Artículos",
        path: "/compras/articulos",
        icon: <ArticleIcon />,
      },
      {
        title: "Almacén",
        path: "/compras/almacen",
        icon: <WarehouseIcon />,
      },
      {
        title: "Autorizaciones",
        path: "/compras/autorizacion-compras",
        icon: <RuleIcon />,
      },
      {
        title: "Proveedores",
        path: "/compras/proveedores",
        icon: <PermContactCalendarIcon />,
      },
    ],
    icon: <StoreIcon />,
  },
];
