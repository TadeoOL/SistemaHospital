import { IModuleItems } from "../types/types";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import StoreIcon from "@mui/icons-material/Store";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArticleIcon from "@mui/icons-material/Article";

export const ModuleItems: IModuleItems[] = [
  {
    title: "Compras",
    path: "/compras",
    childrenItems: [
      {
        title: "Proveedores",
        path: "/compras/proveedores",
        icon: <PermContactCalendarIcon />,
      },
      {
        title: "Solicitud de compras",
        path: "/compras/solicitud-compras",
        icon: <AddShoppingCartIcon />,
      },
      {
        title: "Categorías",
        path: "/compras/categorias",
        icon: <FormatListBulletedIcon />,
      },
      {
        title: "Artículos",
        path: "/compras/articulos",
        icon: <ArticleIcon />,
      },
    ],
    icon: <StoreIcon />,
  },
  {
    title: "Programacion",
    path: "/programacion",
    childrenItems: [
      {
        title: "Agenda Quirofano",
        path: "/programacion/agenda-quirofano",
        icon: <MonitorHeartIcon />,
      },
    ],
    icon: <AssignmentIcon />,
  },
];
