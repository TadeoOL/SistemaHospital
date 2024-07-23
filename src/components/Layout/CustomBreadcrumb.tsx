import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useLocation } from 'react-router-dom';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { IWarehouseData } from '../../types/types';
import { Box } from '@mui/material';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

const messagesByLink: Record<string, string> = {
  '/compras/solicitud-compras': 'Solicitud de Compras',
  '/compras/solicitud-compras/productos-solicitados-orden-compra': 'Solcitudes en Proceso',
  '/compras/solicitud-compras/productos-stock-bajo': 'Alerta de Productos',
  '/compras/categorias/categoria': 'Categorías',
  '/compras/categorias/subcategoria': 'Sub Categorías',
  '/compras/articulos/articulo': 'Catálogo de Artículos',
  '/compras/articulos/articulo-existente': 'Artículos en Existencia',
  '/compras/autorizacion-compras': 'Autorización de Ordenes de Compra',
  '/compras/proveedores': 'Proveedores',
  '/compras/configuracion-compras': 'Configuración de Compras',
  '/compras/autorizacion-compras/autorizaciones': 'Autorizaciones',
  '/compras/autorizacion-compras/historial-autorizaciones': 'Historial de Autorizaciones',
  '/farmacia/configuracion-farmacia': 'Configuración de Farmacia',
  '/farmacia/punto-venta': 'Punto de Venta',
  '/farmacia/solicitud-enfermero': 'Solicitud Enfermero',
  '/farmacia/historial-ventas': 'Historial de Ventas',
  '/farmacia/catalogo': 'Salidas y Existencias',
  '/ventas/caja': 'Caja',
  '/ventas/emitir-recibo': 'Pase a caja',
  '/ventas/historial-cortes': 'Cortes de caja',
};

const warehouseMessages = (warehouseData: IWarehouseData, location: string) => {
  const isInsideSomeWarehouse = location.split('/').filter((ruta) => ruta !== '').length > 1;
  return isInsideSomeWarehouse ? warehouseData.nombre : '';
};

interface TsxByModuleProps {
  module: string;
}
const TsxByModule: React.FC<TsxByModuleProps> = ({ module }) => {
  switch (module) {
    case 'compras':
      return <ViewRender icon={ShoppingCartIcon} title="Compras" />;
    case 'almacenes':
      return <ViewRender icon={WarehouseIcon} title="Almacén" />;
    case 'ventas':
      return <ViewRender icon={PointOfSaleIcon} title="Ventas" />;
    case 'hospitalizacion':
      return <ViewRender icon={MonitorHeartIcon} title="Hospitalización" />;
    default:
      return <ViewRender icon={HomeIcon} title="Inicio" />;
  }
};

const CustomBreadcrumb = () => {
  const location = useLocation();
  const warehouseData = useWarehouseTabsNavStore((state) => state.warehouseData);
  const [currentPageMessage, setCurrentPageMessage] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<string>('');

  useEffect(() => {
    const partesRuta = location.pathname.split('/');
    const primeraParte = partesRuta[1];
    const isInWarehouse = location.pathname.split('/')[1] === 'almacenes';
    const currentMessage = isInWarehouse
      ? warehouseMessages(warehouseData, location.pathname)
      : messagesByLink[location.pathname] || '';

    setCurrentPageMessage(currentMessage);
    setCurrentModule(primeraParte);
  }, [location.pathname, warehouseData]);

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs>
        <TsxByModule module={currentModule} />
        {currentPageMessage ? (
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'black',
              fontWeight: 600,
              fontSize: '1rem',
            }}
            color="text.primary"
          >
            <GrainIcon sx={{ mr: 0.5, fontSize: '22px' }} fontSize="inherit" />
            {currentPageMessage}
          </Typography>
        ) : null}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumb;
interface ViewRenderProps {
  title: string;
  icon: any;
}
const ViewRender: React.FC<ViewRenderProps> = ({ title, icon: Icon }) => {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignContent: 'center' }}>
      <Icon sx={{ mr: 0.5, fontSize: '22px', color: 'black' }} />
      <Typography
        sx={{
          color: 'black',
          fontWeight: 550,
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};
