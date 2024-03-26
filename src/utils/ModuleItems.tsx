import { IModuleItemsList } from "../types/types";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArticleIcon from "@mui/icons-material/Article";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RuleIcon from "@mui/icons-material/Rule";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import {
  purchaseGlobalRoles,
  purchasingDirector,
  supplyRoles,
} from "./dataRoles";

export const ModuleList: IModuleItemsList[] = [
  {
    categoryTitle: "Dashboard",
    moduleItems: [
      {
        title: "Inicio",
        path: "/",
        icon: <DashboardIcon sx={{ color: "#fff" }} />,
      },
    ]
  },
  {
    categoryTitle: "Compras",
    moduleItems: [
      {
        title: "Compras",
        path: "/compras/solicitud-compras",
        icon: <AddShoppingCartIcon sx={{ color: "#fff" }} />,
        protectedRoles: [...supplyRoles, ...purchasingDirector],
        mainDashboard: ["ABASTECIMIENTO", "DIRECTORCOMPRAS"],
      },
      {
        title: "Autorizaciones",
        path: "/compras/autorizacion-compras",
        icon: <RuleIcon sx={{ color: "#fff" }} />,
        protectedRoles: purchasingDirector,
        childrenItems: ["autorizaciones", "historial-autorizaciones"],
      },
      {
        title: "Catálogos",
        icon: <MenuBookOutlinedIcon sx={{ color: "#fff" }} />,
        path: "#",
        topLevel: true,
        children: [
          {
            title: "Artículos",
            path: "/compras/articulos/articulo",
            icon: <ArticleIcon sx={{ color: "#fff" }} />,
            childrenItems: ["articulo", "articulo-existente"],
            protectedRoles: supplyRoles,
          },
          {
            title: "Categorías",
            path: "/compras/categorias/categoria",
            icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
            childrenItems: ["categoria", "subcategoria"],
            protectedRoles: supplyRoles,
          },
          {
            title: "Proveedores",
            path: "/compras/proveedores",
            icon: <PermContactCalendarIcon sx={{ color: "#fff" }} />,
            protectedRoles: supplyRoles,
          },
        ],
      },
      {
        title: "Configuración",
        path: "/compras/configuracion-compras",
        icon: <SettingsIcon sx={{ color: "#fff" }} />,
        protectedRoles: purchasingDirector,
      },
    ]
  },
  
  
  
  // {
  //   title: "Categorías",
  //   path: "/compras/categorias/categoria",
  //   icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
  //   childrenItems: ["categoria", "subcategoria"],
  //   protectedRoles: supplyRoles,
  // },
  // {
  //   title: "Artículos",
  //   path: "/compras/articulos/articulo",
  //   icon: <ArticleIcon sx={{ color: "#fff" }} />,
  //   childrenItems: ["articulo", "articulo-existente"],
  //   protectedRoles: supplyRoles,
  // },
  {
    categoryTitle: "Almacen",
    moduleItems:[
      {
        title: "Almacén",
        path: "/compras/almacen",
        icon: <WarehouseIcon sx={{ color: "#fff" }} />,
        protectedRoles: purchaseGlobalRoles,
      },
    ]
  }
  
  // {
  //   title: "Proveedores",
  //   path: "/compras/proveedores",
  //   icon: <PermContactCalendarIcon sx={{ color: "#fff" }} />,
  //   protectedRoles: supplyRoles,
  // },
  
];
