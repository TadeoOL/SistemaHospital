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
  operatingRoomANDnurse,
  pharmacyDirectorRole,
  pharmacyManager,
  programation,
  purchaseGlobalRoles,
  purchasingDirector,
  supplyRoles,
  xrayAdmin,
} from '@/utils/dataRoles';

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
              icon: icons.Article,
              type: 'item',
              protectedRoles: supplyRoles,
            },
            {
              id: 'categorias',
              title: 'Categorías',
              url: '/compras/categorias',
              icon: icons.FormatListBulleted,
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
          protectedRoles: purchasingDirector,
        },
      ],
    },
    {
      id: 'almacen',
      title: 'Almacén',
      type: 'item',
      url: '/almacenes',
      icon: icons.Warehouse,
      protectedRoles: [...purchaseGlobalRoles, ...purchasingDirector, ...supplyRoles],
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
          protectedRoles: pharmacyManager,
        },
        {
          id: 'salidas-existencias',
          title: 'Salidas y existencias',
          url: '/farmacia/catalogo',
          icon: icons.Article,
          type: 'item',
          protectedRoles: pharmacyManager,
        },
        {
          id: 'historial-ventas',
          title: 'Historial de ventas',
          url: '/farmacia/historial-ventas',
          icon: icons.History,
          type: 'item',
          protectedRoles: pharmacyDirectorRole,
        },
        {
          id: 'configuracion-farmacia',
          title: 'Configuración',
          url: '/farmacia/configuracion-farmacia',
          icon: icons.Settings,
          type: 'item',
          protectedRoles: pharmacyDirectorRole,
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
          protectedRoles: checkout,
        },
        {
          id: 'cierre-cuenta',
          title: 'Cierre de cuenta',
          url: '/ventas/cierre-de-cuenta',
          icon: icons.Receipt,
          type: 'item',
          protectedRoles: closeAccount,
        },
        {
          id: 'emitir-recibo',
          title: 'Emitir Pase a Caja',
          url: '/ventas/emitir-recibo',
          icon: icons.ReceiptLong,
          type: 'item',
          protectedRoles: checkoutSell,
        },
        {
          id: 'facturacion',
          title: 'Facturación',
          url: '/facturas',
          icon: icons.ReceiptLong,
          type: 'item',
          protectedRoles: invoiceAdmin,
        },
        {
          id: 'cuentas-pendientes-por-pagar',
          title: 'Cuentas Pendientes',
          url: '/admision/cuentas-pendientes-por-pagar',
          icon: icons.Receipt,
          type: 'item',
          protectedRoles: purchaseGlobalRoles,
        },
        {
          id: 'historial-cortes',
          title: 'Historial de Cortes',
          url: '/ventas/historial-cortes',
          icon: icons.ManageHistory,
          type: 'item',
          protectedRoles: checkoutAdmin,
        },
        {
          id: 'configuracion-usuarios',
          title: 'Configuración',
          url: '/ventas/configuracion-usuarios',
          icon: icons.Settings,
          type: 'item',
          protectedRoles: checkoutAdmin,
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
          protectedRoles: programation,
        },
        {
          id: 'registro-eventos',
          title: 'Programación de eventos',
          url: '/programacion/registro-eventos',
          icon: icons.HowToReg,
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
              title: 'Gestión de espacios hospitalarios',
              url: '/programacion/gestion-espacios-hospitalarios',
              icon: icons.Hotel,
              type: 'item',
              protectedRoles: programation,
            },
            {
              id: 'categorias-espacios-hospitalarios',
              title: 'Categorías de espacios hospitalarios',
              url: '/programacion/categorias-espacios-hospitalarios',
              icon: icons.Hotel,
              type: 'item',
              protectedRoles: programation,
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
      icon: icons.MonitorHeart,
      children: [
        {
          id: 'solicitud-servicios',
          title: 'Solicitud de Servicios',
          url: '/hospitalizacion/servicios-solicitud',
          icon: icons.FactCheck,
          type: 'item',
          protectedRoles: hospitalizationANDnurse,
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
          protectedRoles: hospitalization,
        },
        {
          id: 'calendario-cuartos',
          title: 'Calendario de cuartos',
          url: '/hospitalizacion/calendario-cuartos-asignados',
          icon: icons.CalendarMonth,
          type: 'item',
          protectedRoles: hospitalizationANDnurse,
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
          protectedRoles: operatingRoomANDnurse,
        },
        {
          id: 'recuperacion',
          title: 'Recuperación',
          url: '/quirofano/recuperacion',
          icon: icons.AirlineSeatFlat,
          type: 'item',
          protectedRoles: operatingRoomANDnurse,
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
              protectedRoles: programation,
            },
            {
              id: 'medicos',
              title: 'Médicos',
              url: '/quirofano/medicos',
              icon: icons.GroupAdd,
              type: 'item',
              protectedRoles: programation,
            },
            {
              id: 'anestesiologos',
              title: 'Anestesiólogos',
              url: '/quirofano/anestesiologos',
              icon: icons.GroupAdd,
              type: 'item',
              protectedRoles: programation,
            },
            {
              id: 'procedimientos-cirugia',
              title: 'Procedimientos de cirugía',
              url: '/quirofano/procedimientos-cirugia',
              icon: icons.Vaccines,
              type: 'item',
              protectedRoles: programation,
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
              title: 'Estudios de Gabinete',
              url: '/servicios/solicitudes',
              icon: icons.LiaXRaySolid,
              type: 'item',
              protectedRoles: hospitalization,
            },
          ],
        },
        {
          id: 'configuracion-solicitudes',
          title: 'Configuración',
          url: '/servicios/configuracion-solicitudes',
          icon: icons.Settings,
          type: 'item',
          protectedRoles: supplyRoles,
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
          protectedRoles: hospitalization,
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
