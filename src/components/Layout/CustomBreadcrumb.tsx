import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation } from 'react-router-dom';
import WarehouseIcon from '@mui/icons-material/Warehouse';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
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
  '/almacenes/dc71b9a9-4691-4da1-ac30-ab7d875cc158': 'Almacén General',
  '/almacenes/fc6d0fdd-8cfa-49a7-863e-206a7542a5e5': 'Almacén Farmacia',
};

const messagesByModule: Record<string, string> = {
  '': 'Inicio',
  compras: 'Compras',
  almacenes: 'Almacen',
};

const CustomBreadcrumb = () => {
  const location = useLocation();
  const [currentPageMessage, setCurrentPageMessage] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<string>('');

  useEffect(() => {
    const currentMessage = messagesByLink[location.pathname] || '';
    setCurrentPageMessage(currentMessage);
  }, [location.pathname]);

  useEffect(() => {
    const partesRuta = location.pathname.split('/');
    const primeraParte = partesRuta[1];
    const currentModule = messagesByModule[primeraParte] || '';
    setCurrentModule(currentModule);
  }, [location.pathname]);

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs
        sx={{
          fontSize: '1rem',
        }}
        aria-label="breadcrumb"
      >
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'black',
            fontWeight: 550,
            fontSize: '1rem',
          }}
          color="inherit"
        >
          {currentModule === 'Compras' ? (
            <ShoppingCartIcon sx={{ mr: 0.5, fontSize: '22px' }} fontSize="inherit" />
          ) : currentModule === 'Almacen' ? (
            <WarehouseIcon sx={{ mr: 0.5, fontSize: '22px' }} fontSize="inherit" />
          ) : (
            <HomeIcon sx={{ mr: 0.5, fontSize: '22px' }} fontSize="inherit" />
          )}
          {currentModule}
        </Typography>
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
