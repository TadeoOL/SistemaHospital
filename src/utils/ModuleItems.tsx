import { IModuleItemsList } from '../types/types';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArticleIcon from '@mui/icons-material/Article';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RuleIcon from '@mui/icons-material/Rule';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { purchaseGlobalRoles, purchasingDirector, supplyRoles } from './dataRoles';
import { LocalPharmacy, PointOfSale, ShoppingBasket } from '@mui/icons-material';

export const ModuleList: IModuleItemsList[] = [
  {
    categoryTitle: 'Dashboard',
    moduleItems: [
      {
        title: 'Inicio',
        path: '/',
        icon: <DashboardIcon sx={{ color: '#fff' }} />,
      },
    ],
  },
  {
    categoryTitle: 'Compras',
    icon: <ShoppingBasket />,
    path: 'compras',
    moduleItems: [
      {
        title: 'Compras',
        path: '/compras/solicitud-compras',
        icon: <AddShoppingCartIcon sx={{ color: '#fff' }} />,
        protectedRoles: [...supplyRoles, ...purchasingDirector],
        mainDashboard: ['ABASTECIMIENTO', 'DIRECTORCOMPRAS'],
      },
      {
        title: 'Autorizaciones',
        path: '/compras/autorizacion-compras',
        icon: <RuleIcon sx={{ color: '#fff' }} />,
        protectedRoles: purchasingDirector,
        childrenItems: ['autorizaciones', 'historial-autorizaciones'],
      },
      {
        title: 'Catálogos',
        icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
        path: '#',
        topLevel: true,
        children: [
          {
            title: 'Artículos',
            path: '/compras/articulos/articulo',
            icon: <ArticleIcon sx={{ color: '#fff' }} />,
            childrenItems: ['articulo', 'articulo-existente'],
            protectedRoles: supplyRoles,
          },
          {
            title: 'Categorías',
            path: '/compras/categorias/categoria',
            icon: <FormatListBulletedIcon sx={{ color: '#fff' }} />,
            childrenItems: ['categoria', 'subcategoria'],
            protectedRoles: supplyRoles,
          },
          {
            title: 'Proveedores',
            path: '/compras/proveedores',
            icon: <PermContactCalendarIcon sx={{ color: '#fff' }} />,
            protectedRoles: supplyRoles,
          },
        ],
      },
      {
        title: 'Configuración',
        path: '/compras/configuracion-compras',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: purchasingDirector,
      },
    ],
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
    categoryTitle: 'Almacen',
    icon: <WarehouseIcon />,
    moduleItems: [
      {
        title: 'Almacén',
        path: '/almacenes',
        icon: <WarehouseIcon sx={{ color: '#fff' }} />,
        protectedRoles: [...purchaseGlobalRoles, ...purchasingDirector, ...supplyRoles],
      },
    ],
    path: 'almacenes',
  },
  {
    categoryTitle: 'Farmacia',
    icon: <LocalPharmacy />,
    moduleItems: [
      {
        title: 'Punto de venta',
        path: '/farmacia/punto-venta',
        icon: <PointOfSale sx={{ color: '#fff' }} />,
        protectedRoles: [...purchaseGlobalRoles, ...purchasingDirector, ...supplyRoles],
      },
      {
        title: 'Configuración',
        path: '/farmacia/configuracion-farmacia',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: [...purchaseGlobalRoles, ...purchasingDirector, ...supplyRoles],
      },
    ],
    path: 'farmacia',
  },

  // {
  //   title: "Proveedores",
  //   path: "/compras/proveedores",
  //   icon: <PermContactCalendarIcon sx={{ color: "#fff" }} />,
  //   protectedRoles: supplyRoles,
  // },
];
