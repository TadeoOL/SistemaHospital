import React, { useState } from 'react';
import AdvertenciaDirecta from '../../../assets/HelpImages/advertencia-autorizacion-orden-de-compra-directa.webp';
import AdvertenciaLit from '../../../assets/HelpImages/advertencia-autorizacion-orden-de-compra-por-licitacion-.webp';
import ModalCero from '../../../assets/HelpImages/modal-0-solicitud-de-compra.webp';
import ModalUno from '../../../assets/HelpImages/modal-1-listado-de-productos-solicitud-de-compra-.webp';
import ModalDos from '../../../assets/HelpImages/modal-2-orden-de-compra-directa.webp';
import ModalTres from '../../../assets/HelpImages/modal-3-orden-de-compra-directa-terminada.webp';
import PantallaPrincipal from '../../../assets/HelpImages/pantalla-principal.webp';
import ProcesoPrincipal from '../../../assets/HelpImages/proceso-principal.webp';
import SeccionPunteada from '../../../assets/HelpImages/seccion-punteada.webp';
import PantallaAlertas from '../../../assets/HelpImages/pantalla-principal-alertas.webp';
import PantallaSolicitudes from '../../../assets/HelpImages/pantalla-principal-solicitudes-en-proceso.webp';
import ProcesoPrincipal2 from '../../../assets/HelpImages/proceso-principal-solicitudes-en-proceso2.webp';
import ProcesoAlerta from '../../../assets/HelpImages/proceso-alerta.webp';
import { Box, Collapse, IconButton, Typography } from '@mui/material';

import { Divider } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { usePurchaseRequestNav } from '../../../store/purchaseStore/purchaseRequestNav';
import { useShallow } from 'zustand/react/shallow';

const imageStyles = { maxWidth: '600px' };

export const MensajeLogin: React.FC = () => {
  return (
    <div>
      <h3>Iniciar Sesión</h3>
      <Divider />
      <h3>¡Bienvenido al Modulo de Acceso!</h3>
      <p>Si eres un usuario registrado, por favor ingresa tu información de inicio de sesión a continuación.</p>
      <h4>Ingreso de Sistema: </h4>
      <p>1. Nombre de Usuario: Ingresa el nombre de usuario que te ha proporcionado anteriormente</p>
      <p>2. Contraseña: Introduce tu contraseña segura y confidencial.</p>
      <br />
      <p>(favor de respetar mayusculas, minúsculas, números y caracteres especiales).</p>
      <br />
      <h4>Recuperar Contraseña: </h4>
      <p>¿Has olvidado tu contraseña? ¡No te preocupes! Te ofrecemos una opción sencilla para recuperarla:</p>

      <p>1. Haz clic en el enlace Recuperar contraseña en la pestaña con el mismo nombre.</p>
      <p>2. Se te pedirá que ingreses tu dirección de correo electrónico asociada con tu cuenta.</p>
      <p>
        3. Una vez ingresada la dirección de correo electrónico, recibirás un mensaje con instrucciones para restablecer
        tu contraseña.
      </p>
      <p>4. Sigue las instrucciones detalladas en el correo electrónico para crear una nueva contraseña segura.</p>

      <h4>Problemas de Acceso:</h4>

      <p>
        Si experimentas problemas para acceder a tu cuenta o recuperar tu contraseña, por favor comunícate con el
        administrador del sistema.
      </p>
    </div>
  );
};
export const MensajeInicio: React.FC = () => {
  return (
    <div>
      <h3>Inicio</h3>
      <Divider />
      <p>Contenido</p>
    </div>
  );
};

export const MensajeOrdenesCompra: React.FC = () => {
  const [openCollapse1, setOpenCollapse1] = useState(false);
  const [openCollapse2, setOpenCollapse2] = useState(false);
  const [openCollapse3, setOpenCollapse3] = useState(false);
  const [openCollapse4, setOpenCollapse4] = useState(false);
  const [openCollapse5, setOpenCollapse5] = useState(false);
  const [openCollapse6, setOpenCollapse6] = useState(false);
  const [openCollapse7, setOpenCollapse7] = useState(false);
  const [openCollapse8, setOpenCollapse8] = useState(false);

  return (
    <div>
      <Divider />
      <h3>MODULO DE COMPRAS</h3>
      <p>
        El módulo de órdenes de compra le permite a los usuarios generar pedidos de productos y servicios de manera
        eficiente. Este manual proporciona instrucciones detalladas sobre cómo utilizar esta funcionalidad.
      </p>
      <p>
        Este modulo permite gestionar las solicitudes de orden de compra que mas adelantes se convertirán en ordenes de
        compras en sus respectivas modalidades.
      </p>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse1(!openCollapse1)}>
          {openCollapse1 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>{openCollapse1 ? 'Ocultar Proceso' : 'Proceso'}</Typography>
      </Box>

      <Collapse in={openCollapse1}>
        <Box>
          <h4>Proceso</h4>
          <img src={ProcesoPrincipal} alt="Proceso Principal" />
          <br />
        </Box>
      </Collapse>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse2(!openCollapse2)}>
          {openCollapse2 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse2 ? 'Ocultar Pantalla Compras' : 'Mostrar Pantalla Compras'}
        </Typography>
      </Box>

      <Collapse in={openCollapse2}>
        <Box>
          <h3>Pantalla Compras</h3>
          <img src={PantallaPrincipal} style={imageStyles} alt="Pantalla Principal" />
          <p>
            <strong>Botón Solicitud de compra:</strong> Permite generar nuevas solicitudes de ordenes de compra.
          </p>
          <p>
            <strong>Columna Ordenes de compra:</strong> Listará todas las ordenes de compra generadas después de
            cualquier proceso de solicitud de ordenes de compra, así como el estatus de cada una.
          </p>
          <p>
            <strong>Columna Solicitudes en proceso:</strong> Listará todas las solicitudes ordenes de compra generadas y
            mostrará el estatus actual de cada una.
          </p>
          <p>
            <strong>Columna Alertas de productos:</strong> Muestra todos los productos que están en estatus de alerta
            (existencia mínima permitida en inventarios).
          </p>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse3(!openCollapse3)}>
          {openCollapse3 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse3 ? 'Ocultar Solicitud de Compra' : 'Solicitud de Compra'}
        </Typography>
      </Box>

      <Collapse in={openCollapse3}>
        <Box>
          <p>
            <strong>BOTON</strong> Solicitud de Compra
          </p>
          <p>
            Este botón nos llevara a la ventana <strong>Solicitud de Compra:</strong>
          </p>
          <img src={ModalCero} style={imageStyles}></img>
          <p>Aquí seleccionaremos:</p>
          <p>
            <strong>Almacén,</strong> Que es el almacén a que va dirigida la compra
          </p>
          <p>
            <strong>Artículos</strong> Que son los artículos que requerimos en nuestra solicitud de Orden de Compra y
            los cuales se encuentran en nuestra base de datos de productos.
          </p>
          <p>
            La búsqueda de estos productos se genera de forma dinámica, es decir, basta teclear solo una parte del la
            descripción del producto y el sistema incluirá en un listado todos los productos similares o exactos a esa
            descripción.
          </p>
          <p>
            <strong>Nota</strong>
            <br />
            En caso de no existir el producto en este listado, será necesario agregarlo en el catalogo de productos.
          </p>

          <p>
            <strong>Cantidad,</strong> Es la cantidad de productos que se desean comprar.
          </p>

          <p>
            <strong>BOTON</strong> Agregar
            <br />
            Finalmente este botón nos permite agregar los productos al listado de pedidos.
          </p>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse4(!openCollapse4)}>
          {openCollapse4 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse4 ? 'Ocultar productos a solicitar' : 'Productos a Solicitar'}
        </Typography>
      </Box>

      <Collapse in={openCollapse4}>
        <Box>
          <h4>Listado de productos a solicitar</h4>
          <img src={ModalUno} style={imageStyles}></img>
          <p>
            Una vez agregado el producto a solicitar el sistema mostrara el precio del producto que actualmente esta
            registrado en el sistema, y que es el mismo que se registro en la ultima compra de dicho producto, sin
            embargo este precio puede ser modificado a consideración según lo cotizado por el proveedor.
          </p>
          <p>
            Después de asignar el precio al producto (ya sea modificarlo o dejarlo como esta) daremos click en cualquier
            parte fuera de la captura de precio.
          </p>

          <p>
            <strong>Nota</strong>
            <br />
            En caso de que se requiera agregar mas productos solo se repiten los pasos dentro de esta misma ventana. Una
            vez finalizada la selección de tus productos utilizaras el bobota <strong>Cancelar</strong> si deseas
            cancelar la solicitud o <strong>Siguiente</strong> para avanzar a las siguientes opciones.
          </p>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse5(!openCollapse5)}>
          {openCollapse5 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse5 ? 'Ocultar criterios para orden de compra directa' : 'Criterios para orden de compra directa'}
        </Typography>
      </Box>

      <Collapse in={openCollapse5}>
        <Box>
          <h3>Criterios para los tipos de orden de compra directa, directa con autorización o con licitación.</h3>
          <p>
            Después de seleccionar los productos a comprar y dar click en el botón <strong>Siguiente</strong>, el
            sistema identificara y asignara el proceso para cada tipo de compra que serán los siguientes:
          </p>

          <p>
            <strong>ORDEN DE COMPRA DIRECTA</strong>
            <br />
            Serán todas aquellas compras que no sobre pasen el limite permitido, Estos criterios serán previamente
            asignados por el administrador del sistema o el administrador de compras dentro del modulo de configuración
            de compras.
          </p>
          <p>
            <strong>ORDEN DE COMPRA DIRECTA CON AUTORIZACIÓN</strong>
            <br />
            Serán todas aquellas compras que no sobre pasen el limite permitido pero que al mismo tiempo no sobre pasan
            el monto asignado para enviar una solicitud a licitación. Estos criterios serán previamente asignados por el
            administrador del sistema o el administrador de compras dentro del modulo de configuración de compras.
          </p>
          <p>
            <strong>ORDEN DE COMPRA POR LICITACIÓN</strong>
            <br />
            Serán todas aquellas compras que no sobre pasen el limite permitido para una compra directa por
            autorizacion. En ese momento la solicitud pasa a un proceso de licitación. Estos criterios serán previamente
            asignados por el administrador del sistema o el administrador de compras dentro del modulo de configuración
            de compras.
          </p>
          <br />
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse6(!openCollapse6)}>
          {openCollapse6 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse6 ? 'Ocultar tipos de orden de compra' : 'Tipos de orden de compra'}
        </Typography>
      </Box>

      <Collapse in={openCollapse6}>
        <Box>
          <h3>PROCESOS PARA LOS TIPOS DE ORDEN DE COMPRA</h3>
          <h4>PROCESO PARA ORDEN DE COMPRA DIRECTA</h4>

          <p>
            Una ves dentro del proceso de solicitud de orden de compra, en caso de no haber superado el monto permitido
            para esta operacion, el sistema te enviara a la pantalla Orden de compra directa.
          </p>
          <img src={ModalDos} style={imageStyles}></img>

          <p>Donde se deberá de proporcionar la siguiente información:</p>
          <p>- Proveedor: Que serla el proveedor a quien ira dirigida la orden de compra</p>
          <p>
            - Subir PDF; Donde deberá anexarse la cotización de la compra. En este proceso tendremos las opciones de:
          </p>
          <p>- Arrastrar y soltar el archivo pdf en la sección punteada</p>
          <p>- Seleccionar y adjuntar el archivo pdf desde el disco duro</p>

          <img src={SeccionPunteada} style={imageStyles}></img>
          <p>
            <strong>RESUMEN DE LA ORDEN DE COMPRA DIRECTA Y GENERAR ORDEN</strong>
            <br />
            Una vez terminado el paso anterior, el sistema mostrara esta pantalla:
          </p>
          <p>
            Donde finalmente revisaremos de manera visual la OC y daremos click en el botón Generar compra, o bien
            tendremos la opción de Cancelar.
          </p>

          <img src={ModalTres} style={imageStyles}></img>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse7(!openCollapse7)}>
          {openCollapse7 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse7 ? 'Ocultar compra directa con autorizacion' : 'Compra directa con autorizacion'}
        </Typography>
      </Box>

      <Collapse in={openCollapse7}>
        <Box>
          <h3>PROCESO PARA ORDEN DE COMPRA DIRECTA CON AUTORIZACION</h3>
          <p>
            Después de realizar la solicitud de orden de compra, en caso de haber superado el monto permitido para
            solicitud directa y al mismo tiempo no haber superado el limite para la solicitud por licitación, el sistema
            mostrara la siguiente pantalla.
          </p>

          <img src={AdvertenciaDirecta} style={imageStyles}></img>

          <p>Donde se deberá de proporcionar la siguiente información:</p>
          <p>- Proveedor: Que serla el proveedor a quien ira dirigida la orden de compra</p>
          <p>
            - Subir PDF; Donde deberá anexarse la cotización de la compra. En este proceso tendremos las opciones de:
          </p>
          <p>- Arrastrar y soltar el archivo pdf en la sección punteada</p>
          <p>- Seleccionar y adjuntar el archivo pdf desde el disco duro</p>

          <img src={SeccionPunteada} style={imageStyles}></img>
          <p>
            Después de proporcionar la informacion, la solicitud pasara al NECESITA AUTORIZACION dentro del listado (o
            la columna) de Solicitudes en proceso y solo deberemos esperar la autorización por parte del usuario de
            nivel superior facultado por el administrador del sistema.
          </p>
        </Box>
      </Collapse>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => setOpenCollapse8(!openCollapse8)}>
          {openCollapse8 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography sx={{ fontWeight: 500, fontSize: 18 }}>
          {openCollapse8 ? 'Ocultar compra por licitación' : 'Compra por licitación'}
        </Typography>
      </Box>

      <Collapse in={openCollapse8}>
        <Box>
          <h3>PROCESO PARA ORDEN DE COMPRA POR LICITACION</h3>
          <p>
            Después de realizar la solicitud de orden de compra, en caso de haber superado el monto permitido para
            solicitud directa con autorización y al mismo tiempo haber superado el limite para la solicitud por
            licitación, el sistema mostrara la siguiente pantalla.
          </p>

          <img src={AdvertenciaLit} style={imageStyles}></img>
          <p>
            De manera obligatoria las licitaciones deberán contar con la invitación y las propuestas de 3 proveedores,
            así es que en esta pantalla de proporcionar la siguiente información:
          </p>
          <p>- Proveedores: Seleccionar 3 proveedores del catalogo de proveedores.</p>

          <p>
            <strong>Nota</strong>
            <br />
            En caso de no existir alguno de los proveedores a invitar, era necesario agregarlo desde el catalogo de
            proveedores.
          </p>
          <p>
            Después de proporcionar la información, la solicitud pasara al NECESITA AUTORIZACION dentro del listado (o
            la columna) de Solicitudes en proceso y solo deberemos esperar la autorización por parte del usuario de
            nivel superior facultado por el administrador del sistema.
          </p>
        </Box>
      </Collapse>
    </div>
  );
};

export const MensajeSolicitudProceso: React.FC = () => {
  return (
    <div>
      <h3>Solicitud Proceso </h3>
      <img src={PantallaSolicitudes} style={imageStyles}></img>
      <Divider />
      <p>
        Este proceso permite identificar, consultar y/o cancelar una solicitud de orden de compra que esta en ese
        momento bajo la administración de un usuario de nivel superior en el proceso de auditoria y autorización de
        Solicitudes.
      </p>
      <h4>Proceso</h4>

      <p>Autorizaciones - Orden de compra</p>
      <p>C con auto - Licita</p>
      <h3>PANTALLA SOLICITUDES EN PROCESO</h3>
      <img src={ProcesoPrincipal2} style={imageStyles}></img>
      <p>Listara todas las solicitudes ordenes de compra generadas y mostrara el estatus actual de cada una.</p>
      <h4>COLUMNA ACCIONES</h4>
      <p>Permite ..............</p>
      <h4>DEFINICION DE CADA ESTATUS</h4>
      <p>
        <strong>- En proceso autorización para OC directa:</strong> Solicitud que supera la compra mínima autorizada y
        que ha sido enviada a revisión y autorización.
      </p>
      <p>
        <strong>- Solicitud a proveedor:</strong> Se ha enviado una invitación a licitacion a proveedores y esta en
        espera de anexar las 3 propuestas
      </p>
      <p>
        <strong>- En proceso autorización OC por licitación:</strong> Solicitud que requiere proceso de licitación. Esta
        solicitud esta siendo evaluada y procesada en el modulo autorización de solicitudes.
      </p>

      <h3>PROCESOS</h3>
      <h4>- OC directa autorizada: ...................</h4>
      <h4>- Solicitud a proveedor autorizada: ..................</h4>
      <h4>- Licitación autorizada: ..........................</h4>
    </div>
  );
};
export const MensajeAlerta: React.FC = () => {
  return (
    <div>
      <h3>PRODUCTOS EN ALERTA</h3>
      <Divider />
      <p>
        Esta pantalla permite al encargado de compras detectar y solicitar con facilidad los productos con criterios de
        bajo inventario que previamente han sido configurados en el sistema, es decir, son productos que requieren un
        mínimo de existencia en inventario.
      </p>
      <h4>PROCESO</h4>
      <img src={ProcesoAlerta} style={imageStyles}></img>
      <p>Solicitud de orden de compra - Criterios de compra - Autorizaciones - Orden de compra</p>
      <p>!! Alerta de productos. C directa - C con auto - Licita</p>
      <h3>PANTALLA PRODUCTOS EN ALERTA</h3>
      <p>
        La visualización de productos en alerta podía segmentarse por cada tipo de almacén,
        <strong> Por ejemplo: Almacen General, Farmacia, etc..</strong>
      </p>
      <img src={PantallaAlertas} style={imageStyles}></img>
      <p>
        <strong>- Botón Solicitar de orden compra:</strong> Permite generar nuevas solicites de ordenes de compra de los
        productos en alerta.
      </p>
      <p>
        <strong>- Columna Articulo en Alerta:</strong> Proporciona la descripción (nombre) del producto.
      </p>
      <p>
        <strong>- Cantidad a comprar:</strong> Muestra la cantidad predeterminada en el sistema como compra minima.
      </p>
      <p>
        <strong>- Cantidad en stock:</strong> Muestra la cantidad que queda en inventario.
      </p>
      <h3>PROCESOS</h3>
      <h4>Selección de productos</h4>
      <p>
        Para solicitar la compra de productos en alerta, basta con seleccionar la casilla al inicio de cada productos.
        Pueden seleccionarse varias a la vez.
      </p>
      <strong>BOTON</strong> Solicitar Orden Compra
      <p>Este botón nos llevara a la ventana Solicitud de Compra e iniciaremos el proceso de solicitud de compra.</p>
      <p>
        <strong>Nota</strong>
        <br />
        La solicitud de compra podrá darse por cada almacén, Por ejemplo: se podrán seleccionar solo las casillas de la
        tabla Farmacia para hacer pedidos al almacén de farmacia.
      </p>
      <p>Si se requiere hacer pedido para otro almacén se deberá de hacerse en especifico.</p>
    </div>
  );
};
export const MensajeProdcutosStockBajo: React.FC = () => {
  return (
    <div>
      <h3>Alerta de productos </h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeProductosSolicitados: React.FC = () => {
  return (
    <div>
      <h3>Solicitud orden compra </h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};
export const MensajeProductosEspera: React.FC = () => {
  return (
    <div>
      <h3>Autorizaciónes</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeCategorias: React.FC = () => {
  return (
    <div>
      <h3>Categorías</h3>
      <Divider />
      <p>Contenido</p>
    </div>
  );
};

export const MensajeSubCategorias: React.FC = () => {
  return (
    <div>
      <h3>Subcategorías</h3>
      <Divider />
      <p>Contenido</p>
    </div>
  );
};

export const MensajeArticulos: React.FC = () => {
  return (
    <div>
      <h3>Catálogo de Artículos</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeArticuloExistente: React.FC = () => {
  return (
    <div>
      <h3>Prodcutos en existencia</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeAlmacen: React.FC = () => {
  return (
    <div>
      <h3>Almacenes</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeAuthCompras: React.FC = () => {
  return (
    <div>
      <h3>Autorización de Ordenes de Compras</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};
export const MensajeHistorialCompras: React.FC = () => {
  return (
    <div>
      <h3>Historial de ordenes de compras</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeProveedores: React.FC = () => {
  return (
    <div>
      <h3>Proveedores</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const MensajeConfig: React.FC = () => {
  return (
    <div>
      <h3>Configuracion Compras</h3>
      <Divider />
      <p>Contenido </p>
    </div>
  );
};

export const PurchaseMessages = () => {
  const tabValue = usePurchaseRequestNav(useShallow((state) => state.tabValue));

  const renderMessage = () => {
    switch (tabValue) {
      case 0:
        return <MensajeOrdenesCompra />;
      case 1:
        return <MensajeSolicitudProceso />;
      case 2:
        return <MensajeAlerta />;
      default:
        return null;
    }
  };
  return renderMessage();
};
