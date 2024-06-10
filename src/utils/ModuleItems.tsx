import { IModuleItemsList } from '../types/types';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArticleIcon from '@mui/icons-material/Article';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RuleIcon from '@mui/icons-material/Rule';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  checkout,
  checkoutAdmin,
  checkoutSell,
  pharmacyDirectorRole,
  pharmacyManager,
  purchaseGlobalRoles,
  purchasingDirector,
  supplyRoles,
} from './dataRoles';
import {
  History,
  Hotel,
  HowToReg,
  LocalHospital,
  LocalPharmacy,
  PointOfSale,
  ShoppingBasket,
  Vaccines,
} from '@mui/icons-material';

export const ModuleList: IModuleItemsList[] = [
  {
    categoryTitle: 'Dashboard',
    moduleItems: [
      {
        title: 'Inicio',
        path: '/',
        icon: <DashboardIcon sx={{ color: '#fff' }} />,
        mainDashboard: purchaseGlobalRoles,
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
        protectedRoles: supplyRoles,
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
        protectedRoles: pharmacyManager,
      },
      {
        title: 'Configuración',
        path: '/farmacia/configuracion-farmacia',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: pharmacyDirectorRole,
      },
      {
        title: 'Salidas y existencias',
        path: '/farmacia/catalogo',
        icon: <ArticleIcon sx={{ color: '#fff' }} />,
        protectedRoles: pharmacyManager,
      },
      {
        title: 'Historial de ventas',
        path: '/farmacia/historial-ventas',
        icon: <History sx={{ color: '#fff' }} />,
        protectedRoles: pharmacyDirectorRole,
      },
    ],
    path: 'farmacia',
  },
  {
    categoryTitle: 'Ventas',
    icon: <PointOfSale />,
    moduleItems: [
      {
        title: 'Caja',
        path: '/ventas/caja',
        icon: <PointOfSale sx={{ color: '#fff' }} />,
        protectedRoles: checkout,
        mainDashboard: checkout,
      },
      {
        title: 'Emitir Pase a Caja',
        path: '/ventas/emitir-recibo',
        icon: <ReceiptLongIcon sx={{ color: '#fff' }} />,
        protectedRoles: checkoutSell,
        mainDashboard: checkoutSell,
      },
      {
        title: 'Historial de cortes',
        path: '/ventas/historial-cortes',
        icon: <ManageHistoryIcon sx={{ color: '#fff' }} />,
        protectedRoles: checkoutAdmin,
        mainDashboard: checkoutAdmin,
      },
      {
        title: 'Configuración',
        path: '/ventas/configuracion-usuarios',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: checkoutAdmin,
      },
    ],
    path: 'ventas',
  },
  {
    categoryTitle: 'Programacion',
    icon: <LocalHospital />,
    moduleItems: [
      {
        title: 'Registro de pacientes',
        path: '/programacion/registro',
        icon: <HowToReg sx={{ color: '#fff' }} />,
        protectedRoles: checkout,
      },
      {
        title: 'Catálogos',
        icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
        path: '#',
        protectedRoles: supplyRoles,
        topLevel: true,
        children: [
          {
            title: 'Cuartos',
            path: '/programacion/cuartos',
            icon: <Hotel sx={{ color: '#fff' }} />,
            protectedRoles: supplyRoles,
          },
          {
            title: 'Procedimientos de crujía',
            path: '/programacion/procedimientos-cirujia',
            icon: <Vaccines sx={{ color: '#fff' }} />,
            protectedRoles: supplyRoles,
          },
        ],
      },
      {
        title: 'Programación de eventos',
        path: '/programacion/registro-eventos',
        icon: <HowToReg sx={{ color: '#fff' }} />,
        protectedRoles: checkout,
      },
      {
        title: 'Configuración',
        path: '/programacion/configuracion',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: checkout,
      },
    ],
    path: 'programacion',
  },
];
