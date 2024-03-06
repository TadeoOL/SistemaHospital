import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import {
  MensajeInicio,
  MensajeOrdenesCompra,
  MensajeProdcutosStockBajo,
  MensajeArticulos,
  MensajeCategorias,
  MensajeProductosSolicitados,
  MensajeProductosEspera,
  MensajeSubCategorias,
  MensajeArticuloExistente,
  MensajeAlmacen,
  MensajeAuthCompras,
  MensajeProveedores,
  MensajeConfig,
} from "./Help/HelpMessage";

interface RightSideNavProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
}

const messagesByLink: { [key: string]: React.ReactNode } = {
  "/": <MensajeInicio />,
  "/compras/solicitud-compras/ordenes-compra": <MensajeOrdenesCompra />,
  "/compras/solicitud-compras/productos-stock-bajo": (
    <MensajeProdcutosStockBajo />
  ),
  "/compras/solicitud-compras/productos-solicitados-orden-compra": (
    <MensajeProductosSolicitados />
  ),
  "/compras/solicitud-compras/productos-espera-autorizacion": (
    <MensajeProductosEspera />
  ),
  "/compras/categorias/categoria": <MensajeCategorias />,
  "/compras/categorias/subcategoria": <MensajeSubCategorias />,
  "/compras/articulos/articulo": <MensajeArticulos />,
  "/compras/articulos/articulo-existente": <MensajeArticuloExistente />,
  "/compras/almacen": <MensajeAlmacen />,
  "/compras/autorizacion-compras": <MensajeAuthCompras />,
  "/compras/proveedores": <MensajeProveedores />,
  "/compras/configuracion-compras": <MensajeConfig />,
};

const RightSideNav: React.FC<RightSideNavProps> = ({
  open,
  onClose,
  currentPage,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List>
        <ListItem>
          <ListItemText primary={messagesByLink[currentPage]} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default RightSideNav;
