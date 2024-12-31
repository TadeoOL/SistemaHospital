import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';

// project import
import Drawer from '../Drawer';
import Header from '../Header/Header';
// import Footer from './Footer';
// import HorizontalBar from './Drawer/HorizontalBar';
// import Loader from 'components/Loader';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
// import AddCustomer from 'sections/apps/customer/AddCustomer';
// import AuthGuard from 'utils/route-guard/AuthGuard';

import { MenuOrientation } from '@/config';
import useConfig from '@/hooks/useConfig';
import { useLayoutStore } from '../Drawer/stores/layoutStore';
import LoadingView from '@/views/LoadingView/LoadingView';
import CustomBreadcrumb from '@/components/Layout/CustomBreadcrumb';
import { IWarehouseData } from '@/types/types';
import { useWarehouseTabsNavStore } from '@/store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store/auth';

// ==============================|| MAIN LAYOUT ||============================== //

const returnTitleForDashboard = (rol: string[]) => {
  if (rol.some((r) => r === 'ABASTECIMIENTO') || rol.some((r) => r === 'DIRECTORCOMPRAS')) {
    return 'Compras';
  } else {
    return '';
  }
};

export default function DashboardLayout() {
  const location = useLocation();
  const [_currentPage, setCurrentPage] = useState<string>(location.pathname);
  const profile = useAuthStore(useShallow((state) => state.profile));

  const messagesByLink: Record<string, string> = {
    '/compras/solicitud-compras/ordenes-compra': 'Ordenes de Compra',
    '/compras/solicitud-compras/productos-solicitados-orden-compra': 'Solcitudes en Proceso',
    '/compras/solicitud-compras/productos-stock-bajo': 'Alerta de Productos',
    '/compras/categorias': 'Categorías',
    '/compras/subcategorias': 'Sub Categorias',
    '/compras/articulos': 'Catálogo de Artículos',
    '/compras/articulos/articulo-existente': 'Productos en Existencia',
    '/compras/autorizacion-compras': 'Autorización de Ordenes de Compra',
    '/compras/proveedores': 'Proveedores',
    '/compras/configuracion-compras': 'Configuración de compras',
    '/compras/autorizacion-compras/autorizaciones': 'Autorizaciones',
    '/compras/autorizacion-compras/historial-autorizaciones': 'Historial de Autorizaciones',
    '/compras/solicitud-compras': 'Compras',
    '/almacenes': 'Almacén',
    '/farmacia/configuracion-farmacia': 'Configuración de Farmacia',
    '/farmacia/punto-venta': 'Punto de Venta',
    '/farmacia/historial-ventas': 'Historial de Ventas',
    '/hospitalizacion/solicitud-enfermero': 'Solicitud Enfermero',
    '/farmacia/catalogo': 'Salidas y Existencias',
    '/ventas/caja': 'Caja del dia',
    '/ventas/emitir-recibo': 'Pase a caja',
    '/ventas/historial-cortes': 'Historial de cortes de caja',
    '/ventas/cierre-de-cuenta': 'Cierre de cuenta',
    '/ventas/corte-caja': 'Caja del Día',
    '/hospitalizacion/servicios-solicitud': 'Solicitud de Servicios',
    '/hospitalizacion/solicitudes-administracion': 'Autorización de Estudio de Gabinete',
    '/admision/ingreso-pacientes': 'Ingreso de pacientes',
    '/facturacion/cuentas-facturables': 'Cuentas Facturables',
    '/quirofano/operaciones-del-dia': 'Operaciones del día',
    '/quirofano/recuperacion': 'Recuperación',
    '/quirofano/paquetes-quirurgicos': 'Paquetes Quirurgicos',
    '/hospitalizacion/anestesiologos': 'Anestesiologos',
    '/hospitalizacion/guardias-anestesiologos': 'Guardias Anestesiologos',
    '/hospitalizacion/cuartos-hospitalarios': 'Cuartos Hospitalarios',
    '/hospitalizacion/cuartos-hospitalarios-asignados': 'Cuartos Hospitalarios Asignados',
    '/hospitalizacion/armado-paquetes-quirurgicos': 'Armado de Paquetes Quirurgicos',
    '/hospitalizacion/calendario-cuartos-asignados': 'Calendario de Cuartos Asignados',
    '/hospitalizacion/configuracion-hospitalizacion': 'Configuración de Hospitalización',
    '/admision/cuentas-pendientes-por-pagar': 'Cuentas Pendientes por Pagar',
    '/programacion/registro': 'Registro de Pacientes',
    '/programacion/gestion-espacios-hospitalarios': 'Gestión de Espacios Hospitalarios',
    '/programacion/categorias-espacios-hospitalarios': 'Categorías de Espacios Hospitalarios',
    '/programacion/procedimientos-cirugia': 'Procedimientos de Cirugía',
    '/programacion/registro-eventos': 'Programación de Eventos',
    '/hospitalizacion/equipo-biomedico': 'Equipo Biomédico',
    '/hospitalizacion/solicitudes': 'Estudios de Gabinete',
    '/hospitalizacion/configuracion-solicitudes': 'Configuración de Estudios de Gabinete',
    '/hospitalizacion/medicos': 'Medicos',
    '/hospitalizacion/guardias-medicos': 'Calendario de Guardias Medicos',
    '/reportes/caja': 'Reporte de Caja',
    '/tesoreria/revolvente/menu': 'Revolvente',
    '/tesoreria/revolvente/estado-de-cuenta': 'Revolvente',
    '/tesoreria/revolvente/cajas': 'Revolvente',
    '/tesoreria/bancos/menu': 'Bancos',
    '/tesoreria/bancos/estado-de-cuenta': 'Bancos',
    '/tesoreria/bancos/compras': 'Bancos',
    '/tesoreria/direccion/menu': 'Direccion',
    '/tesoreria/direccion/depositos': 'Direccion',
    '/tesoreria/direccion/movimientos': 'Direccion',
  };

  const warehouseMessages = (warehouseData: IWarehouseData, location: string) => {
    const isInsideSomeWarehouse = location.split('/').filter((ruta) => ruta !== '').length > 1;
    if (warehouseData.esSubAlmacen) return isInsideSomeWarehouse ? 'Sub Almacén ' + warehouseData.nombre : '';
    else return isInsideSomeWarehouse ? 'Almacén ' + warehouseData.nombre : '';
  };

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const [currentPageMessage, setCurrentPageMessage] = useState<string>('');
  const warehouseData = useWarehouseTabsNavStore((state) => state.warehouseData);

  useEffect(() => {
    if (location.pathname.includes('/almacenes')) {
      const pathSegments = location.pathname.split('/');
      const currentMessage =
        pathSegments.length > 2 ? warehouseMessages(warehouseData, location.pathname) : 'Almacenes Principales';
      setCurrentPageMessage(currentMessage);
    } else {
      setCurrentPageMessage(messagesByLink[location.pathname]);
    }
  }, [location.pathname, warehouseData]);

  if (!profile) return;

  const { setDrawerOpen } = useLayoutStore((s) => ({
    setDrawerOpen: s.setDrawerOpen,
  }));

  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      {/* {!isHorizontal ? <Drawer /> : <HorizontalBar />} */}
      <Drawer />

      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 0, sm: 2 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Suspense fallback={<LoadingView />}>
            <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
              <Container maxWidth={'xl'}>
                <CustomBreadcrumb />
                <Typography variant="h2" sx={{ pt: 3, pb: 2 }}>
                  {currentPageMessage === '' ? returnTitleForDashboard(profile?.roles) : currentPageMessage}
                </Typography>
                <Outlet />
              </Container>
            </Box>
          </Suspense>
          {/* {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />} */}
          {/* <Footer /> */}
        </Container>
      </Box>
    </Box>
  );
}
