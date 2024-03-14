import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import {
  MensajeInicio,
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
  MensajeHistorialCompras,
  PurchaseMessages,
} from "./Help/HelpMessage";
import { useAuthStore } from "../../store/auth";

interface RightSideNavProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
}

const messagesByLink: { [key: string]: any } = {
  "/": <MensajeInicio />,
  "/compras/solicitud-compras": <PurchaseMessages />,
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
  "/compras/autorizacion-compras/autorizaciones": <MensajeAuthCompras />,
  "/compras/autorizacion-compras/historial-autorizaciones": (
    <MensajeHistorialCompras />
  ),
  "/compras/proveedores": <MensajeProveedores />,
  "/compras/configuracion-compras": <MensajeConfig />,
};

const RightSideNav: React.FC<RightSideNavProps> = ({
  open,
  onClose,
  currentPage,
}) => {
  let messageByLink = messagesByLink[currentPage];
  const profile = useAuthStore((state) => state.profile);

  if (currentPage === "/" && profile) {
    if (profile.roles.includes("DIRECTORCOMPRAS")) {
      messageByLink = <MensajeAuthCompras />;
    } else if (profile.roles.includes("ABASTECIMIENTO")) {
      messageByLink = <PurchaseMessages />;
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: "616px" }}>
        <ListItem>
          <ListItemText primary={messageByLink} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default RightSideNav;
