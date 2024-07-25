import { styled } from '@mui/material/styles';
import { TopNav } from './TopNav';
import { SideNav } from './SideNav';
import { Outlet } from 'react-router-dom';
import { useAppNavStore } from '../../store/appNav';
import CustomBreadcrumb from './CustomBreadcrumb';
import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { useAuthStore } from '../../store/auth';
import { useShallow } from 'zustand/react/shallow';
import LoadingView from '../../views/LoadingView/LoadingView';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { IWarehouseData } from '../../types/types';

const SIDE_NAV_WIDTH = 110;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  [theme.breakpoints.up('lg')]: {
    marginLeft: 0,
  },
}));

const LayoutContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
  marginLeft: useAppNavStore((state) => state.open) ? SIDE_NAV_WIDTH : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('lg')]: {
    marginLeft: SIDE_NAV_WIDTH,
  },
}));

const returnTitleForDashboard = (rol: string[]) => {
  if (rol.some((r) => r === 'ABASTECIMIENTO') || rol.some((r) => r === 'DIRECTORCOMPRAS')) {
    return 'Compras';
  } else {
    return '';
  }
};

export const Layout: React.FC = () => {
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(location.pathname);
  const profile = useAuthStore(useShallow((state) => state.profile));

  const messagesByLink: Record<string, string> = {
    '/compras/solicitud-compras/ordenes-compra': 'Ordenes de Compra',
    '/compras/solicitud-compras/productos-solicitados-orden-compra': 'Solcitudes en Proceso',
    '/compras/solicitud-compras/productos-stock-bajo': 'Alerta de Productos',
    '/compras/categorias/categoria': 'Categorías y Sub Categorias',
    '/compras/articulos/articulo': 'Catálogo de Artículos',
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
    '/farmacia/solicitud-enfermero': 'Solicitud Enfermero',
    '/farmacia/catalogo': 'Salidas y Existencias',
    '/ventas/caja': 'Caja del dia',
    '/ventas/emitir-recibo': 'Pase a caja',
    '/ventas/historial-cortes': 'Historial de cortes de caja',
    '/ventas/corte-caja': 'Caja del Día',
    '/hospitalizacion/radiografias-solicitud': 'Solicitud de Estudio de Gabinete',
    '/hospitalizacion/solicitudes-administracion': 'Autorización de Estudio de Gabinete',
  };

  const warehouseMessages = (warehouseData: IWarehouseData, location: string) => {
    const isInsideSomeWarehouse = location.split('/').filter((ruta) => ruta !== '').length > 1;
    if (warehouseData.esSubAlmacen) return isInsideSomeWarehouse ? 'Sub Almacén ' + warehouseData.nombre : '';
    else return isInsideSomeWarehouse ? 'Almacén ' + warehouseData.nombre : '';
  };

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
  return (
    <>
      <TopNav toggleSidebar={toggleSidebar} currentPage={currentPage} />
      <SideNav />
      <LayoutRoot>
        <LayoutContainer>
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
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
