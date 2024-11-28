// assets
import BuildOutlined from '@ant-design/icons/BuildOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import LinkOutlined from '@ant-design/icons/LinkOutlined';
import { LiaXRaySolid } from 'react-icons/lia';
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
  MonitorHeart,
  PointOfSale,
  ShoppingBasket,
  Vaccines,
  MedicationLiquid,
  MedicalServices,
  AttachMoney,
  Work,
  Report,
  PermContactCalendar,
  AddShoppingCart,
  FormatListBulleted,
  Article,
  Warehouse,
  Rule,
  Dashboard,
  Settings,
  ManageHistory,
  FactCheck,
  MenuBookOutlined,
  ReceiptLong,
  Assignment,
} from '@mui/icons-material';

// type
import { NavItemType } from '@/types/menu';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined,
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
  MonitorHeart,
  PointOfSale,
  ShoppingBasket,
  Vaccines,
  MedicationLiquid,
  MedicalServices,
  AttachMoney,
  Work,
  Report,
  PermContactCalendar,
  AddShoppingCart,
  FormatListBulleted,
  Article,
  Warehouse,
  Rule,
  Dashboard,
  Settings,
  ManageHistory,
  FactCheck,
  MenuBookOutlined,
  ReceiptLong,
  LiaXRaySolid,
  Assignment,
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

// export const ModuleList: IModuleItemsList[] = [
//   {
//     categoryTitle: 'Inicio',
//     moduleItems: [
//       {
//         title: 'Inicio',
//         path: '/',
//         icon: <DashboardIcon sx={{ color: '#fff' }} />,
//         mainDashboard: purchaseGlobalRoles,
//       },
//     ],
//   },
//   {
//     categoryTitle: 'Compras',
//     icon: <ShoppingBasket />,
//     path: 'compras',
//     moduleItems: [
//       {
//         title: 'Compras',
//         path: '/compras/solicitud-compras',
//         icon: <AddShoppingCartIcon sx={{ color: '#fff' }} />,
//         protectedRoles: [...supplyRoles, ...purchasingDirector],
//         mainDashboard: ['ABASTECIMIENTO', 'DIRECTORCOMPRAS'],
//       },
//       {
//         title: 'Autorizaciones',
//         path: '/compras/autorizacion-compras',
//         icon: <RuleIcon sx={{ color: '#fff' }} />,
//         protectedRoles: purchasingDirector,
//         childrenItems: ['autorizaciones', 'historial-autorizaciones'],
//       },
//       {
//         title: 'Catálogos',
//         icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
//         path: '#',
//         protectedRoles: supplyRoles,
//         topLevel: true,
//         children: [
//           {
//             title: 'Artículos',
//             path: '/compras/articulos',
//             icon: <ArticleIcon sx={{ color: '#fff' }} />,
//             childrenItems: ['articulo', 'articulo-existente'],
//             protectedRoles: supplyRoles,
//           },
//           {
//             title: 'Categorías',
//             path: '/compras/categorias',
//             icon: <FormatListBulletedIcon sx={{ color: '#fff' }} />,
//             childrenItems: ['categoria', 'subcategoria'],
//             protectedRoles: supplyRoles,
//           },
//           {
//             title: 'Subcategorías',
//             path: '/compras/subcategorias',
//             icon: <FormatListBulletedIcon sx={{ color: '#fff' }} />,
//             childrenItems: ['categoria', 'subcategoria'],
//             protectedRoles: supplyRoles,
//           },
//           {
//             title: 'Proveedores',
//             path: '/compras/proveedores',
//             icon: <PermContactCalendarIcon sx={{ color: '#fff' }} />,
//             protectedRoles: supplyRoles,
//           },
//         ],
//       },
//       {
//         title: 'Configuración',
//         path: '/compras/configuracion-compras',
//         icon: <SettingsIcon sx={{ color: '#fff' }} />,
//         protectedRoles: purchasingDirector,
//       },
//     ],
//   },
//   {
//     categoryTitle: 'Almacen',
//     icon: <WarehouseIcon />,
//     moduleItems: [
//       {
//         title: 'Almacén',
//         path: '/almacenes',
//         icon: <WarehouseIcon sx={{ color: '#fff' }} />,
//         protectedRoles: [...purchaseGlobalRoles, ...purchasingDirector, ...supplyRoles],
//       },
//     ],
//     path: 'almacenes',
//   },
//   {
//     categoryTitle: 'Farmacia',
//     icon: <LocalPharmacy />,
//     moduleItems: [
//       {
//         title: 'Punto de venta',
//         path: '/farmacia/punto-venta',
//         icon: <PointOfSale sx={{ color: '#fff' }} />,
//         protectedRoles: pharmacyManager,
//       },
//       {
//         title: 'Salidas y existencias',
//         path: '/farmacia/catalogo',
//         icon: <ArticleIcon sx={{ color: '#fff' }} />,
//         protectedRoles: pharmacyManager,
//       },
//       {
//         title: 'Historial de ventas',
//         path: '/farmacia/historial-ventas',
//         icon: <History sx={{ color: '#fff' }} />,
//         protectedRoles: pharmacyDirectorRole,
//       },
//       {
//         title: 'Configuración',
//         path: '/farmacia/configuracion-farmacia',
//         icon: <SettingsIcon sx={{ color: '#fff' }} />,
//         protectedRoles: pharmacyDirectorRole,
//       },
//     ],
//     path: 'farmacia',
//   },
//   {
//     categoryTitle: 'Caja', //Antes Ventas
//     icon: <PointOfSale />,
//     moduleItems: [
//       {
//         title: 'Caja del Día',
//         path: '/ventas/caja',
//         icon: <PointOfSale sx={{ color: '#fff' }} />,
//         protectedRoles: checkout,
//         mainDashboard: checkout,
//       },
//       {
//         title: 'Cierre de cuenta',
//         path: '/ventas/cierre-de-cuenta',
//         icon: <Receipt sx={{ color: '#fff' }} />,
//         protectedRoles: closeAccount,
//       },
//       {
//         title: 'Emitir Pase a Caja',
//         path: '/ventas/emitir-recibo',
//         icon: <ReceiptLongIcon sx={{ color: '#fff' }} />,
//         protectedRoles: checkoutSell,
//         mainDashboard: checkoutSell,
//       },
//       {
//         title: 'Facturación',
//         path: '/facturas',
//         icon: <LiaFileInvoiceDollarSolid />,
//         protectedRoles: invoiceAdmin,
//       },
//       {
//         title: 'Cuentas Pendientes Por Pagar',
//         path: '/admision/cuentas-pendientes-por-pagar',
//         icon: <Receipt sx={{ color: '#fff' }} />,
//         protectedRoles: purchaseGlobalRoles,
//       },
//       {
//         title: 'Historial de Cortes',
//         path: '/ventas/historial-cortes',
//         icon: <ManageHistoryIcon sx={{ color: '#fff' }} />,
//         protectedRoles: checkoutAdmin,
//         mainDashboard: checkoutAdmin,
//       },
//       {
//         title: 'Configuración',
//         path: '/ventas/configuracion-usuarios',
//         icon: <SettingsIcon sx={{ color: '#fff' }} />,
//         protectedRoles: checkoutAdmin,
//       },
//     ],
//     path: 'ventas',
//   },
//   {
//     categoryTitle: 'Programacion',
//     icon: <LocalHospital />,
//     moduleItems: [
//       {
//         title: 'Registro de pacientes',
//         path: '/programacion/registro',
//         icon: <HowToReg sx={{ color: '#fff' }} />,
//         protectedRoles: programation,
//       },
//       {
//         title: 'Programación de eventos',
//         path: '/programacion/registro-eventos',
//         icon: <HowToReg sx={{ color: '#fff' }} />,
//         protectedRoles: programation,
//       },
//       {
//         title: 'Catálogos',
//         icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
//         path: '#',
//         protectedRoles: programation,
//         topLevel: true,
//         children: [
//           {
//             title: 'Gestión de espacios hospitalarios',
//             path: '/programacion/gestion-espacios-hospitalarios',
//             icon: <Hotel sx={{ color: '#fff' }} />,
//             protectedRoles: programation,
//           },
//           {
//             title: 'Categorías de espacios hospitalarios',
//             path: '/programacion/categorias-espacios-hospitalarios',
//             icon: <FaHouseChimneyMedical />,
//             protectedRoles: programation,
//           },
//         ],
//       },
//     ],
//     path: 'programacion',
//   },
//   {
//     categoryTitle: 'Admisión',
//     icon: <SensorDoor />,
//     moduleItems: [
//       {
//         title: 'Ingreso de pacientes',
//         path: '/admision/ingreso-pacientes',
//         icon: <MeetingRoom />,
//         protectedRoles: admission,
//       },
//       {
//         title: 'Consultas médicas',
//         path: '/admision/consultas-medicas',
//         icon: <MedicalServices />,
//         protectedRoles: admission,
//       },
//     ],
//     path: 'admision',
//   },
//   {
//     categoryTitle: 'Hospitalización',
//     icon: <MonitorHeart />,
//     moduleItems: [
//       {
//         title: 'Solicitud de Servicios',
//         path: '/hospitalizacion/servicios-solicitud',
//         icon: <LiaXRaySolid />,
//         protectedRoles: hospitalizationANDnurse,
//       },
//       {
//         title: 'Solicitud de Artículos',
//         path: '/hospitalizacion/solicitud-enfermero',
//         icon: <FactCheckIcon sx={{ color: '#fff' }} />,
//         protectedRoles: nurseRole,
//       },
//       {
//         title: 'Cuartos Hospitalarios',
//         path: '/hospitalizacion/cuartos-hospitalarios',
//         icon: <FaHospitalSymbol />,
//         protectedRoles: hospitalization,
//       },
//       {
//         title: 'Calendario de cuartos',
//         path: '/hospitalizacion/calendario-cuartos-asignados',
//         icon: <CalendarMonth sx={{ color: '#fff' }} />,
//         protectedRoles: hospitalizationANDnurse,
//       },
//     ],
//     path: 'hospitalizacion',
//   },
//   {
//     categoryTitle: 'Quirófano',
//     icon: <MonitorHeart />,
//     moduleItems: [
//       {
//         title: 'Operaciones del dia',
//         path: '/quirofano/operaciones-del-dia',
//         icon: <GiMedicalDrip />,
//         protectedRoles: operatingRoomANDnurse,
//       },
//       {
//         title: 'Recuperación',
//         path: '/quirofano/recuperacion',
//         icon: <AirlineSeatFlat sx={{ color: '#fff' }} />,
//         protectedRoles: operatingRoomANDnurse,
//       },
//       {
//         title: 'Catálogos',
//         icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
//         path: '#',
//         protectedRoles: programation,
//         topLevel: true,
//         children: [
//           {
//             title: 'Paquetes Quirúrgicos',
//             path: '/quirofano/paquetes-quirurgicos',
//             icon: <Work sx={{ color: '#fff' }} />,
//             protectedRoles: programation,
//           },
//           {
//             title: 'Medicos',
//             path: '/quirofano/medicos',
//             icon: <FaUserDoctor />,
//             protectedRoles: programation,
//           },
//           {
//             title: 'Anestesiólogos',
//             path: '/quirofano/anestesiologos',
//             icon: <GroupAdd sx={{ color: '#fff' }} />,
//             protectedRoles: programation,
//           },
//           {
//             title: 'Procedimientos de cirugía',
//             path: '/quirofano/procedimientos-cirugia',
//             icon: <Vaccines sx={{ color: '#fff' }} />,
//             protectedRoles: programation,
//           },
//         ],
//       },
//     ],
//     path: 'quirofano',
//   },
//   {
//     categoryTitle: 'Servicios',
//     icon: <MedicationLiquid />,
//     moduleItems: [
//       {
//         title: 'Administrar Solicitudes de Servicios',
//         path: '/servicios/solicitudes-administracion',
//         icon: <FactCheckIcon sx={{ color: '#fff' }} />,
//         protectedRoles: xrayAdmin, //Cambiar aca por admin de radiografia-radiologo
//       },
//       {
//         title: 'Catálogos',
//         icon: <MenuBookOutlinedIcon sx={{ color: '#fff' }} />,
//         path: '#',
//         protectedRoles: hospitalization,
//         topLevel: true,
//         children: [
//           /*{
//             title: 'Equipo Biomédico',
//             path: '/biomedico/equipo-biomedico',
//             icon: <MedicalInformation sx={{ color: '#fff' }} />,
//             protectedRoles: hospitalization,
//           },*/
//           {
//             title: 'Estudios de Gabinete',
//             path: '/servicios/solicitudes',
//             icon: <LiaXRaySolid />,
//             protectedRoles: hospitalization,
//           },
//         ],
//       },
//       {
//         title: 'Configuración',
//         path: '/servicios/configuracion-solicitudes',
//         icon: <SettingsIcon />,
//         protectedRoles: supplyRoles,
//       },
//     ],
//     path: 'biomedico',
//   },
//   {
//     categoryTitle: 'Presupuestos',
//     icon: <AttachMoney />,
//     moduleItems: [
//       {
//         title: 'Guardias Medicos',
//         path: '/presupuestos/guardias-medicos',
//         icon: <FaLaptopMedical />,
//         protectedRoles: hospitalization,
//       },
//     ],
//     path: 'presupuestos',
//   },
//   {
//     categoryTitle: 'Enfermería',
//     icon: <MedicalServices />,
//     moduleItems: [
//       {
//         title: 'Cuartos Asignados',
//         path: '/enfermeria/cuartos-hospitalarios-asignados',
//         icon: <FaHospitalSymbol />,
//         protectedRoles: nurseRole,
//       },
//     ],
//     path: 'enfermeria',
//   },
//   {
//     categoryTitle: 'Reportes',
//     icon: <AssignmentIcon />,
//     moduleItems: [
//       {
//         title: 'Reporte de Caja',
//         path: '/reportes/caja',
//         icon: <PointOfSale />,
//         protectedRoles: nurseRole,
//       },
//     ],
//     path: 'reportes',
//   },
// ];

const applications: NavItemType = {
  id: 'group-applications',
  title: '',
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'inicio',
      title: 'Inicio',
      type: 'item',
      url: '/inicio',
      icon: icons.Dashboard,
    },
    {
      id: 'compras',
      title: 'Compras',
      type: 'collapse',
      icon: icons.AddShoppingCart,
      children: [
        {
          id: 'solicitudes-compra',
          title: 'Compras',
          url: '/compras/solicitud-compras',
          icon: icons.AddShoppingCart,
          type: 'item',
        },
        {
          id: 'autorizaciones',
          title: 'Autorizaciones',
          url: '/compras/autorizacion-compras',
          icon: icons.Rule,
          type: 'item',
        },
        {
          id: 'catalogos',
          title: 'Catálogos',
          icon: icons.MenuBookOutlined,
          type: 'collapse',
          children: [
            {
              id: 'articulos',
              title: 'Artículos',
              url: '/compras/articulos',
              icon: icons.Article,
              type: 'item',
            },
            {
              id: 'categorias',
              title: 'Categorías',
              url: '/compras/categorias',
              icon: icons.FormatListBulleted,
              type: 'item',
            },
            {
              id: 'subcategorias',
              title: 'Subcategorías',
              url: '/compras/subcategorias',
              icon: icons.FormatListBulleted,
              type: 'item',
            },
            {
              id: 'proveedores',
              title: 'Proveedores',
              url: '/compras/proveedores',
              icon: icons.PermContactCalendar,
              type: 'item',
            },
          ],
        },
        {
          id: 'configuracion',
          title: 'Configuración',
          url: '/compras/configuracion-compras',
          icon: icons.Settings,
          type: 'item',
        },
      ],
    },
    {
      id: 'almacen',
      title: 'Almacén',
      type: 'item',
      url: '/almacenes',
      icon: icons.Warehouse,
    },
    {
      id: 'farmacia',
      title: 'Farmacia',
      type: 'collapse',
      icon: icons.LocalPharmacy,
      children: [
        {
          id: 'punto-venta',
          title: 'Punto de venta',
          url: '/farmacia/punto-venta',
          icon: icons.PointOfSale,
          type: 'item',
        },
        {
          id: 'salidas-existencias',
          title: 'Salidas y existencias',
          url: '/farmacia/catalogo',
          icon: icons.Article,
          type: 'item',
        },
        {
          id: 'historial-ventas',
          title: 'Historial de ventas',
          url: '/farmacia/historial-ventas',
          icon: icons.History,
          type: 'item',
        },
        {
          id: 'configuracion-farmacia',
          title: 'Configuración',
          url: '/farmacia/configuracion-farmacia',
          icon: icons.Settings,
          type: 'item',
        },
      ],
    },
    {
      id: 'caja',
      title: 'Caja',
      type: 'collapse',
      icon: icons.PointOfSale,
      children: [
        {
          id: 'caja-dia',
          title: 'Caja del Día',
          url: '/ventas/caja',
          icon: icons.PointOfSale,
          type: 'item',
        },
        {
          id: 'cierre-cuenta',
          title: 'Cierre de cuenta',
          url: '/ventas/cierre-de-cuenta',
          icon: icons.Receipt,
          type: 'item',
        },
        {
          id: 'emitir-recibo',
          title: 'Emitir Pase a Caja',
          url: '/ventas/emitir-recibo',
          icon: icons.ReceiptLong,
          type: 'item',
        },
        {
          id: 'facturacion',
          title: 'Facturación',
          url: '/facturas',
          icon: icons.ReceiptLong,
          type: 'item',
        },
        {
          id: 'cuentas-pendientes-por-pagar',
          title: 'Cuentas Pendientes',
          url: '/admision/cuentas-pendientes-por-pagar',
          icon: icons.Receipt,
          type: 'item',
        },
        {
          id: 'historial-cortes',
          title: 'Historial de Cortes',
          url: '/ventas/historial-cortes',
          icon: icons.ManageHistory,
          type: 'item',
        },
        {
          id: 'configuracion-usuarios',
          title: 'Configuración',
          url: '/ventas/configuracion-usuarios',
          icon: icons.Settings,
          type: 'item',
        },
      ],
    },
    {
      id: 'programacion',
      title: 'Programación',
      type: 'collapse',
      icon: icons.LocalHospital,
      children: [
        {
          id: 'registro-pacientes',
          title: 'Registro de pacientes',
          url: '/programacion/registro',
          icon: icons.HowToReg,
          type: 'item',
        },
        {
          id: 'registro-eventos',
          title: 'Programación de eventos',
          url: '/programacion/registro-eventos',
          icon: icons.HowToReg,
          type: 'item',
        },
        {
          id: 'catalogos',
          title: 'Catálogos',
          icon: icons.MenuBookOutlined,
          type: 'collapse',
          children: [
            {
              id: 'gestion-espacios-hospitalarios',
              title: 'Gestión de espacios hospitalarios',
              url: '/programacion/gestion-espacios-hospitalarios',
              icon: icons.Hotel,
              type: 'item',
            },
            {
              id: 'categorias-espacios-hospitalarios',
              title: 'Categorías de espacios hospitalarios',
              url: '/programacion/categorias-espacios-hospitalarios',
              icon: icons.Hotel,
              type: 'item',
            },
          ],
        },
      ],
    },
    {
      id: 'admision',
      title: 'Admisión',
      type: 'collapse',
      icon: icons.SensorDoor,
      children: [
        {
          id: 'ingreso-pacientes',
          title: 'Ingreso de pacientes',
          url: '/admision/ingreso-pacientes',
          icon: icons.MeetingRoom,
          type: 'item',
        },
        {
          id: 'consultas-medicas',
          title: 'Consultas médicas',
          url: '/admision/consultas-medicas',
          icon: icons.MedicalServices,
          type: 'item',
        },
      ],
    },
    {
      id: 'hospitalizacion',
      title: 'Hospitalización',
      type: 'collapse',
      icon: icons.MonitorHeart,
      children: [
        {
          id: 'solicitud-servicios',
          title: 'Solicitud de Servicios',
          url: '/hospitalizacion/servicios-solicitud',
          icon: icons.FactCheck,
          type: 'item',
        },
        {
          id: 'solicitud-articulos',
          title: 'Solicitud de Artículos',
          url: '/hospitalizacion/solicitud-enfermero',
          icon: icons.FactCheck,
          type: 'item',
        },
        {
          id: 'cuartos-hospitalarios',
          title: 'Cuartos Hospitalarios',
          url: '/hospitalizacion/cuartos-hospitalarios',
          icon: icons.Hotel,
          type: 'item',
        },
        {
          id: 'calendario-cuartos',
          title: 'Calendario de cuartos',
          url: '/hospitalizacion/calendario-cuartos-asignados',
          icon: icons.CalendarMonth,
          type: 'item',
        },
      ],
    },
    {
      id: 'quirofano',
      title: 'Quirófano',
      type: 'collapse',
      icon: icons.MonitorHeart,
      children: [
        {
          id: 'operaciones-dia',
          title: 'Operaciones del dia',
          url: '/quirofano/operaciones-del-dia',
          icon: icons.AirlineSeatFlat,
          type: 'item',
        },
        {
          id: 'recuperacion',
          title: 'Recuperación',
          url: '/quirofano/recuperacion',
          icon: icons.AirlineSeatFlat,
          type: 'item',
        },
        {
          id: 'catalogos',
          title: 'Catálogos',
          icon: icons.MenuBookOutlined,
          type: 'collapse',
          children: [
            {
              id: 'paquetes-quirurgicos',
              title: 'Paquetes Quirúrgicos',
              url: '/quirofano/paquetes-quirurgicos',
              icon: icons.Work,
              type: 'item',
            },
            {
              id: 'medicos',
              title: 'Médicos',
              url: '/quirofano/medicos',
              icon: icons.GroupAdd,
              type: 'item',
            },
            {
              id: 'anestesiologos',
              title: 'Anestesiólogos',
              url: '/quirofano/anestesiologos',
              icon: icons.GroupAdd,
              type: 'item',
            },
            {
              id: 'procedimientos-cirugia',
              title: 'Procedimientos de cirugía',
              url: '/quirofano/procedimientos-cirugia',
              icon: icons.Vaccines,
              type: 'item',
            },
          ],
        },
      ],
    },
    {
      id: 'servicios',
      title: 'Servicios',
      type: 'collapse',
      icon: icons.MedicationLiquid,
      children: [
        {
          id: 'solicitudes-administracion',
          title: 'Administrar Solicitudes de Servicios',
          url: '/servicios/solicitudes-administracion',
          icon: icons.FactCheck,
          type: 'item',
        },
        {
          id: 'catalogos',
          title: 'Catálogos',
          icon: icons.MenuBookOutlined,
          type: 'collapse',
          children: [
            {
              id: 'estudios-gabinete',
              title: 'Estudios de Gabinete',
              url: '/servicios/solicitudes',
              icon: icons.LiaXRaySolid,
              type: 'item',
            },
          ],
        },
        {
          id: 'configuracion-solicitudes',
          title: 'Configuración',
          url: '/servicios/configuracion-solicitudes',
          icon: icons.Settings,
          type: 'item',
        },
      ],
    },
    {
      id: 'presupuestos',
      title: 'Presupuestos',
      type: 'collapse',
      icon: icons.AttachMoney,
      children: [
        {
          id: 'guardias-medicos',
          title: 'Guardias Medicos',
          url: '/presupuestos/guardias-medicos',
          icon: icons.Work,
          type: 'item',
        },
      ],
    },
    {
      id: 'enfermeria',
      title: 'Enfermería',
      type: 'collapse',
      icon: icons.MedicalServices,
      children: [
        {
          id: 'cuartos-hospitalarios-asignados',
          title: 'Cuartos Asignados',
          url: '/enfermeria/cuartos-hospitalarios-asignados',
          icon: icons.Hotel,
          type: 'item',
        },
      ],
    },
    {
      id: 'reportes',
      title: 'Reportes',
      type: 'collapse',
      icon: icons.Assignment,
      children: [
        {
          id: 'reporte-caja',
          title: 'Reporte de Caja',
          url: '/reportes/caja',
          icon: icons.PointOfSale,
          type: 'item',
        },
      ],
    },
  ],
};

export default applications;
