import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  Avatar,
  Badge,
  Popover,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { useAppNavStore } from "../../store/appNav";
import { AccountPopover } from "./AccountPopover";
import { useAuthStore } from "../../store/auth";
import homelogo from "../../assets/homeLogoHSB.svg";
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

export const TopNav: React.FC<{
  toggleSidebar: () => void;
  currentPage: string;
}> = ({ toggleSidebar, currentPage }) => {
  const profile = useAuthStore((state) => state.profile);
  const isOpen = useAppNavStore((state) => state.open);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notificationsPopoverOpen, setNotificationsPopoverOpen] =
    useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleNotificationsButtonClick = () => {
    setNotificationsPopoverOpen(!notificationsPopoverOpen);
  };

  const handleNotificationsPopoverClose = () => {
    setNotificationsPopoverOpen(false);
  };

  const SIDE_NAV_WIDTH = 80;
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

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

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            xl: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            xl: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
          height: 60,
          alignItems: "center",
          display: "flex",
          flex: 1,
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            marginLeft: !xlUp && isOpen ? 29 : isOpen ? 19 : 0,
            transition: "margin-left 0.3s ease-in-out",
            justifyContent: "space-between",
            flexDirection: "row",
            display: "flex",
            flex: 1,
          }}
        >
          <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
            <IconButton size="small" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Box component="img" src={homelogo} sx={{ height: 30 }} />
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              columnGap: 2,
              mr: 2,
            }}
          >
            <IconButton onClick={handleNotificationsButtonClick}>
              <HelpIcon />
            </IconButton>
            <Popover
              open={notificationsPopoverOpen}
              anchorEl={anchorRef.current}
              onClose={handleNotificationsPopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box p={2}>{messagesByLink[currentPage]}</Box>
            </Popover>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={4} color="success" variant="dot">
                  <SvgIcon fontSize="small">
                    <NotificationsActiveIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={handleOpen}
              ref={anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              src={profile?.imagenURL}
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};
