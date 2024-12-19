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
  Balance,
  FindInPage,
  Category,
  ShoppingCart,
  SwapVerticalCircle,
  InsertInvitation,
  Sell,
  AccountBalance,
  PersonAdd,
  Bed,
  HotTub,
  AirlineSeatReclineExtra,
  Healing,
  Masks,
  Inventory,
  MedicalInformation,
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
  AirlineSeatReclineExtra,
  Healing,
  Receipt,
  Sell,
  AccountBalance,
  MeetingRoom,
  SensorDoor,
  CalendarMonth,
  GroupAdd,
  Masks,
  History,
  Hotel,
  MedicalInformation,
  Bed,
  HotTub,
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
  Inventory,
  MenuBookOutlined,
  ReceiptLong,
  Assignment,
  Balance,
  FindInPage,
  Category,
  ShoppingCart,
  SwapVerticalCircle,
  InsertInvitation,
  PersonAdd,
};

import {
  purchaseGlobalRoles,
  supplyRoles,
  purchasingDirector,
  warehouse,
  pharmacyManager,
  programation,
  admission,
  hospitalization,
  operatingRoom,
  nurseRole,
  xrayAdmin,
  checkout,
  checkoutDirector,
  invoiceAdmin,
  reports,
} from '@/utils/dataRoles';

const sideBarRoutes: NavItemType[] = [
  {
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
            protectedRoles: [...supplyRoles, ...purchasingDirector],
          },
          {
            id: 'autorizaciones',
            title: 'Autorizaciones',
            url: '/compras/autorizacion-compras',
            icon: icons.Rule,
            type: 'item',
            protectedRoles: purchasingDirector,
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
                icon: icons.Vaccines,
                type: 'item',
                protectedRoles: supplyRoles,
              },
              {
                id: 'subcategorias',
                title: 'Subcategorías',
                url: '/compras/subcategorias',
                icon: icons.FormatListBulleted,
                type: 'item',
                protectedRoles: supplyRoles,
              },
              {
                id: 'categorias',
                title: 'Categorías',
                url: '/compras/categorias',
                icon: icons.Category,
                type: 'item',
                protectedRoles: supplyRoles,
              },

              {
                id: 'proveedores',
                title: 'Proveedores',
                url: '/compras/proveedores',
                icon: icons.PermContactCalendar,
                type: 'item',
                protectedRoles: supplyRoles,
              },
            ],
          },
          {
            id: 'configuracion',
            title: 'Configuración',
            url: '/compras/configuracion-compras',
            icon: icons.Settings,
            type: 'item',
            protectedRoles: purchaseGlobalRoles,
          },
        ],
      },
      {
        id: 'almacen',
        title: 'Almacén',
        type: 'item',
        url: '/almacenes',
        icon: icons.Warehouse,
        protectedRoles: warehouse,
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
            icon: icons.ShoppingCart,
            type: 'item',
            protectedRoles: pharmacyManager,
          },
          {
            id: 'salidas-existencias',
            title: 'Salidas y Existencias',
            url: '/farmacia/catalogo',
            icon: icons.SwapVerticalCircle,
            type: 'item',
            protectedRoles: pharmacyManager,
          },
          {
            id: 'configuracion-farmacia',
            title: 'Configuración',
            url: '/farmacia/configuracion-farmacia',
            icon: icons.Settings,
            type: 'item',
            protectedRoles: purchaseGlobalRoles,
          },
        ],
      },

      {
        id: 'programacion',
        title: 'Programación',
        type: 'collapse',
        icon: icons.InsertInvitation,
        children: [
          {
            id: 'registro-pacientes',
            title: 'Registro de pacientes',
            url: '/programacion/registro',
            icon: icons.PersonAdd,
            type: 'item',
            protectedRoles: programation,
          },
          {
            id: 'registro-eventos',
            title: 'Programación de eventos',
            url: '/programacion/registro-eventos',
            icon: icons.CalendarMonth,
            type: 'item',
            protectedRoles: programation,
          },
          {
            id: 'catalogos',
            title: 'Catálogos',
            icon: icons.MenuBookOutlined,
            type: 'collapse',
            children: [
              {
                id: 'gestion-espacios-hospitalarios',
                title: 'Gestión de Espacios',
                url: '/programacion/gestion-espacios-hospitalarios',
                icon: icons.Bed,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
              {
                id: 'categorias-espacios-hospitalarios',
                title: 'Categorías de Espacios',
                url: '/programacion/categorias-espacios-hospitalarios',
                icon: icons.HotTub,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
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
            protectedRoles: admission,
          },
          {
            id: 'consultas-medicas',
            title: 'Consultas médicas',
            url: '/admision/consultas-medicas',
            icon: icons.MedicalServices,
            type: 'item',
            protectedRoles: admission,
          },
        ],
      },
      {
        id: 'hospitalizacion',
        title: 'Hospitalización',
        type: 'collapse',
        icon: icons.AirlineSeatFlat,
        children: [
          {
            id: 'solicitud-servicios',
            title: 'Solicitud de Servicios',
            url: '/hospitalizacion/servicios-solicitud',
            icon: icons.FactCheck,
            type: 'item',
            protectedRoles: nurseRole,
          },
          {
            id: 'solicitud-articulos',
            title: 'Solicitud de Artículos',
            url: '/hospitalizacion/solicitud-enfermero',
            icon: icons.FactCheck,
            type: 'item',
            protectedRoles: nurseRole,
          },
          {
            id: 'cuartos-hospitalarios',
            title: 'Cuartos Hospitalarios',
            url: '/hospitalizacion/cuartos-hospitalarios',
            icon: icons.Hotel,
            type: 'item',
            protectedRoles: [...nurseRole, ...hospitalization],
          },
          {
            id: 'calendario-cuartos',
            title: 'Calendario de cuartos',
            url: '/hospitalizacion/calendario-cuartos-asignados',
            icon: icons.CalendarMonth,
            type: 'item',
            protectedRoles: hospitalization,
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
            icon: icons.AirlineSeatReclineExtra,
            type: 'item',
            protectedRoles: operatingRoom,
          },
          {
            id: 'recuperacion',
            title: 'Recuperación',
            url: '/quirofano/recuperacion',
            icon: icons.Healing,
            type: 'item',
            protectedRoles: [...nurseRole, ...operatingRoom],
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
                icon: icons.Inventory,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
              {
                id: 'medicos',
                title: 'Médicos',
                url: '/quirofano/medicos',
                icon: icons.Masks,
                type: 'item',
                protectedRoles: operatingRoom,
              },
              {
                id: 'anestesiologos',
                title: 'Anestesiólogos',
                url: '/quirofano/anestesiologos',
                icon: icons.GroupAdd,
                type: 'item',
                protectedRoles: operatingRoom,
              },
              {
                id: 'procedimientos-cirugia',
                title: 'Cirugías',
                url: '/quirofano/procedimientos-cirugia',
                icon: icons.Vaccines,
                type: 'item',
                protectedRoles: operatingRoom,
              },
            ],
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
            protectedRoles: nurseRole,
          },
          {
            id: 'armado-paquetes-quirurgicos',
            title: 'Armado de Paquetes',
            url: '/enfermeria/armado-paquetes-quirurgicos',
            icon: icons.MedicalInformation,
            type: 'item',
            protectedRoles: nurseRole,
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
            title: 'Administrar Solicitudes',
            url: '/servicios/solicitudes-administracion',
            icon: icons.FactCheck,
            type: 'item',
            protectedRoles: xrayAdmin, //Cambiar aca por admin de radiografia-radiologo
          },
          {
            id: 'catalogos',
            title: 'Catálogos',
            icon: icons.MenuBookOutlined,
            type: 'collapse',
            children: [
              {
                id: 'estudios-gabinete',
                title: 'Servicios',
                url: '/servicios/solicitudes',
                icon: icons.FindInPage,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
            ],
          },
          {
            id: 'configuracion-solicitudes',
            title: 'Configuración',
            url: '/servicios/configuracion-solicitudes',
            icon: icons.Settings,
            type: 'item',
            protectedRoles: purchaseGlobalRoles,
          },
        ],
      },
      {
        id: 'caja',
        title: 'Caja',
        type: 'collapse',
        icon: icons.AccountBalance,
        children: [
          {
            id: 'caja-dia',
            title: 'Caja del Día',
            url: '/ventas/caja',
            icon: icons.PointOfSale,
            type: 'item',
            protectedRoles: [...checkout, ...checkoutDirector],
          },
          {
            id: 'cierre-cuenta',
            title: 'Cierre de cuenta',
            url: '/ventas/cierre-de-cuenta',
            icon: icons.Receipt,
            type: 'item',
            protectedRoles: [...checkout, ...checkoutDirector],
          },
          {
            id: 'emitir-recibo',
            title: 'Emitir Pase a Caja',
            url: '/ventas/emitir-recibo',
            icon: icons.Sell,
            type: 'item',
            protectedRoles: checkoutDirector,
          },
          {
            id: 'configuracion-usuarios',
            title: 'Configuración',
            url: '/ventas/configuracion-usuarios',
            icon: icons.Settings,
            type: 'item',
            protectedRoles: purchaseGlobalRoles,
          },
        ],
      },
      // {
      //   id: 'presupuestos',
      //   title: 'Presupuestos',
      //   type: 'collapse',
      //   icon: icons.AttachMoney,
      //   children: [
      //     {
      //       id: 'guardias-medicos',
      //       title: 'Guardias Medicos',
      //       url: '/presupuestos/guardias-medicos',
      //       icon: icons.Work,
      //       type: 'item',
      //       protectedRoles: hospitalization,
      //     },
      //   ],
      // },

      {
        id: 'facturacion',
        title: 'Facturación',
        icon: icons.ReceiptLong,
        type: 'collapse',
        protectedRoles: invoiceAdmin,
        children: [
          {
            id: 'facturas',
            title: 'Cuentas Facturables',
            url: '/facturacion/cuentas-facturables',
            icon: icons.ReceiptLong,
            type: 'item',
            protectedRoles: invoiceAdmin,
          },
          {
            id: 'configuracion-facturacion',
            title: 'Configuración',
            url: '/facturacion/configuracion',
            icon: icons.Settings,
            type: 'item',
            protectedRoles: invoiceAdmin,
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
            protectedRoles: reports,
          },
        ],
      },
      {
        id: 'tesoreria',
        title: 'Tesoreria',
        type: 'collapse',
        icon: icons.Balance,
        protectedRoles: purchaseGlobalRoles,
        children: [
          {
            id: 'revolvente',
            title: 'Revolvente',
            url: '/tesoreria/revolvente/menu',
            icon: icons.PointOfSale,
            type: 'collapse',
            protectedRoles: purchaseGlobalRoles,
            children: [
              {
                id: 'revolvente-estado-de-cuenta',
                title: 'Estado de Cuenta',
                url: '/tesoreria/revolvente/estado-de-cuenta',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
              {
                id: 'cajas',
                title: 'Cajas',
                url: '/tesoreria/revolvente/cajas',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
            ],
          },
          {
            id: 'bancos',
            title: 'Bancos',
            url: '/tesoreria/bancos/menu',
            icon: icons.PointOfSale,
            type: 'collapse',
            protectedRoles: purchaseGlobalRoles,
            children: [
              {
                id: 'bancos-estado-de-cuenta',
                title: 'Estado de cuenta',
                url: '/tesoreria/bancos/estado-de-cuenta',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
              {
                id: 'bancos-compras',
                title: 'Compras',
                url: '/tesoreria/bancos/compras',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
            ],
          },
          {
            id: 'direccion',
            title: 'Direccion',
            url: '/tesoreria/direccion/menu',
            icon: icons.PointOfSale,
            type: 'collapse',
            protectedRoles: purchaseGlobalRoles,
            children: [
              {
                id: 'direccion-depositos',
                title: 'Depositos',
                url: '/tesoreria/direccion/depositos',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
              {
                id: 'direccion-movimientos',
                title: 'Movimientos',
                url: '/tesoreria/direccion/movimientos',
                icon: icons.PointOfSale,
                type: 'item',
                protectedRoles: purchaseGlobalRoles,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default sideBarRoutes;
