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
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  admission,
  checkout,
  checkoutAdmin,
  checkoutSell,
  closeAccount,
  hospitalization,
  hospitalizationANDnurse,
  invoiceAdmin,
  nurseRole,
  operatingRoom,
  operatingRoomANDnurse,
  pharmacyDirectorRole,
  pharmacyManager,
  programation,
  purchaseGlobalRoles,
  purchasingDirector,
  supplyRoles,
  xrayAdmin,
} from './dataRoles';
import {
  AirlineSeatFlat,
  Receipt,
  MeetingRoom,
  SensorDoor,
  CalendarMonth,
  GroupAdd,
  History,
  Hotel,
  HowToReg,
  LocalHospital,
  LocalPharmacy,
  MedicalInformation,
  MonitorHeart,
  PendingActions,
  PointOfSale,
  ShoppingBasket,
  Vaccines,
} from '@mui/icons-material';
import { LiaXRaySolid } from 'react-icons/lia';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaLaptopMedical } from 'react-icons/fa';
import { GiMedicalDrip } from 'react-icons/gi';
import { FaHouseChimneyMedical } from 'react-icons/fa6';
import { FaHospitalSymbol } from 'react-icons/fa';
import { FaFileInvoice } from 'react-icons/fa';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';

export const ModuleList: IModuleItemsList[] = [
  {
    categoryTitle: 'Inicio',
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
      {
        title: 'Solicitud enfermero',
        path: '/farmacia/solicitud-enfermero',
        icon: <FactCheckIcon sx={{ color: '#fff' }} />,
        protectedRoles: nurseRole,
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
        protectedRoles: programation,
      },
      {
        title: 'Catálogos',
        icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
        path: '#',
        protectedRoles: programation,
        topLevel: true,
        children: [
          {
            title: 'Gestión de espacios hospitalarios',
            path: '/programacion/gestion-espacios-hospitalarios',
            icon: <Hotel sx={{ color: '#fff' }} />,
            protectedRoles: programation,
          },
          {
            title: 'Categorías de espacios hospitalarios',
            path: '/programacion/categorias-espacios-hospitalarios',
            icon: <FaHouseChimneyMedical />,
            protectedRoles: programation,
          },
          {
            title: 'Procedimientos de cirugía',
            path: '/programacion/procedimientos-cirugia',
            icon: <Vaccines sx={{ color: '#fff' }} />,
            protectedRoles: programation,
          },
        ],
      },
      {
        title: 'Programación de eventos',
        path: '/programacion/registro-eventos',
        icon: <HowToReg sx={{ color: '#fff' }} />,
        protectedRoles: programation,
      },
      /*       {
        title: 'Configuración',
        path: '/programacion/configuracion',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: checkout,
      }, */
      {
        title: 'Solicitud de programacion',
        path: '/programacion/solicitud-programacion',
        icon: <PendingActions sx={{ color: '#fff' }} />,
        protectedRoles: programation,
      },
    ],
    path: 'programacion',
  },
  {
    categoryTitle: 'Admisión',
    icon: <SensorDoor />,
    moduleItems: [
      {
        title: 'Ingreso de pacientes',
        path: '/admision/ingreso-pacientes',
        icon: <MeetingRoom />,
        protectedRoles: admission,
      },
      {
        title: 'Cierre de cuenta',
        path: '/admision/cierre-de-cuenta',
        icon: <Receipt sx={{ color: '#fff' }} />,
        protectedRoles: closeAccount,
      },
      {
        title: 'Cuentas Pendientes Por Pagar',
        path: '/admision/cuentas-pendientes-por-pagar',
        icon: <Receipt sx={{ color: '#fff' }} />,
        protectedRoles: purchaseGlobalRoles,
      },
    ],
    path: 'admision',
  },
  {
    categoryTitle: 'Hospitalización',
    icon: <MonitorHeart />,
    moduleItems: [
      {
        title: 'Catálogos',
        icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
        path: '#',
        protectedRoles: hospitalization,
        topLevel: true,
        children: [
          {
            title: 'Anestesiólogos',
            path: '/hospitalizacion/anestesiologos',
            icon: <GroupAdd sx={{ color: '#fff' }} />,
            protectedRoles: hospitalization,
          },
          {
            title: 'Equipo Biomédico',
            path: '/hospitalizacion/equipo-biomedico',
            icon: <MedicalInformation sx={{ color: '#fff' }} />,
            protectedRoles: hospitalization,
          },
          {
            title: 'Estudios de Gabinete',
            path: '/hospitalizacion/solicitudes',
            icon: <LiaXRaySolid />,
            protectedRoles: hospitalization,
          },
          {
            title: 'Configuración de Solicitudes de Estudio',
            path: '/hospitalizacion/configuracion-solicitudes',
            icon: <SettingsIcon />,
            protectedRoles: supplyRoles,
          },
          {
            title: 'Medicos',
            path: '/hospitalizacion/medicos',
            icon: <FaUserDoctor />,
            protectedRoles: hospitalization,
          },
          {
            title: 'Guardias Medicos',
            path: '/hospitalizacion/guardias-medicos',
            icon: <FaLaptopMedical />,
            protectedRoles: hospitalization, //Hospitalizacion
          },
        ],
      },
      {
        title: 'Solicitar Estudio de Gabinete',
        path: '/hospitalizacion/radiografias-solicitud',
        icon: <LiaXRaySolid />,
        protectedRoles: hospitalizationANDnurse,
      },
      {
        title: 'Administrar Solicitudes de Estudios de Gabinete',
        path: '/hospitalizacion/solicitudes-administracion',
        icon: <FactCheckIcon sx={{ color: '#fff' }} />,
        protectedRoles: xrayAdmin, //Cambiar aca por admin de radiografia-radiologo
      },
      {
        title: 'Guardias Anestesiologos',
        path: '/hospitalizacion/guardias-anestesiologos',
        icon: <GiMedicalDrip />,
        protectedRoles: hospitalization,
      },
      {
        title: 'Cuartos Hospitalarios',
        path: '/hospitalizacion/cuartos-hospitalarios',
        icon: <FaHospitalSymbol />,
        protectedRoles: hospitalization,
      },
      {
        title: 'Cuartos Asignados',
        path: '/hospitalizacion/cuartos-hospitalarios-asignados',
        icon: <FaHospitalSymbol />,
        protectedRoles: nurseRole,
      },
      {
        title: 'Calendario de cuartos',
        path: '/hospitalizacion/calendario-cuartos-asignados',
        icon: <CalendarMonth sx={{ color: '#fff' }} />,
        protectedRoles: hospitalizationANDnurse,
      },
      {
        title: 'Configuración',
        path: '/hospitalizacion/configuracion-hospitalizacion',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: hospitalization,
      },
    ],
    path: 'hospitalizacion',
  },
  {
    categoryTitle: 'Quirófano',
    icon: <MonitorHeart />,
    moduleItems: [
      {
        title: 'Operaciones del dia',
        path: '/quirofano/operaciones-del-dia',
        icon: <GiMedicalDrip />,
        protectedRoles: operatingRoomANDnurse,
      },
      {
        title: 'Configuración',
        path: '/quirofano/configuracion',
        icon: <SettingsIcon sx={{ color: '#fff' }} />,
        protectedRoles: operatingRoom,
      },
      {
        title: 'Recuperación',
        path: '/quirofano/recuperacion',
        icon: <AirlineSeatFlat sx={{ color: '#fff' }} />,
        protectedRoles: operatingRoomANDnurse,
      },
    ],
    path: 'quirofano',
  },
  {
    categoryTitle: 'Facturación',
    icon: <FaFileInvoice />,
    moduleItems: [
      {
        title: 'Facturaciones',
        path: '/facturas',
        icon: <LiaFileInvoiceDollarSolid />,
        protectedRoles: invoiceAdmin,
      },
    ],
    path: 'facturas',
  },
];
