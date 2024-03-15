import { styled } from "@mui/material/styles";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";
import { useAppNavStore } from "../../store/appNav";
import CustomBreadcrumb from "./CustomBreadcrumb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { useAuthStore } from "../../store/auth";
import { useShallow } from "zustand/react/shallow";

const SIDE_NAV_WIDTH = 110;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  [theme.breakpoints.up("lg")]: {
    marginLeft: 0,
  },
}));

const LayoutContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
  marginLeft: useAppNavStore((state) => state.open) ? SIDE_NAV_WIDTH : 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up("lg")]: {
    marginLeft: SIDE_NAV_WIDTH,
  },
}));

const returnTitleForDashboard = (rol: string[]) => {
  if (
    rol.some((r) => r === "ABASTECIMIENTO") ||
    rol.some((r) => r === "DIRECTORCOMPRAS")
  ) {
    return "Compras";
  } else {
    return "";
  }
};

export const Layout: React.FC = () => {
  const isOpen = useAppNavStore((state) => state.open);
  const setIsOpen = useAppNavStore((state) => state.setOpen);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(location.pathname);
  const profile = useAuthStore(useShallow((state) => state.profile));

  const messagesByLink: Record<string, string> = {
    "/compras/solicitud-compras/ordenes-compra": "Ordenes de Compra",
    "/compras/solicitud-compras/productos-solicitados-orden-compra":
      "Solcitudes en Proceso",
    "/compras/solicitud-compras/productos-stock-bajo": "Alerta de Productos",
    "/compras/categorias/categoria": "Categorías",
    "/compras/categorias/subcategoria": "Sub categorías",
    "/compras/articulos/articulo": "Catálogo de Productos",
    "/compras/articulos/articulo-existente": "Productos en Existencia",
    "/compras/almacen": "Almacén",
    "/compras/autorizacion-compras": "Autorización de ordenes de compra",
    "/compras/proveedores": "Proveedores",
    "/compras/configuracion-compras": "Configuración de compras",
    "/compras/autorizacion-compras/autorizaciones": "Autorizaciones",
    "/compras/autorizacion-compras/historial-autorizaciones":
      "Historial de Autorizaciones",
    "/compras/solicitud-compras": "Compras",
  };

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [currentPageMessage, setCurrentPageMessage] = useState<string>("");

  useEffect(() => {
    const currentMessage = messagesByLink[location.pathname] || "";
    setCurrentPageMessage(currentMessage);
  }, [location.pathname]);

  if (!profile) return;
  return (
    <>
      <TopNav toggleSidebar={toggleSidebar} currentPage={currentPage} />
      <SideNav />
      <LayoutRoot>
        <LayoutContainer>
          <CustomBreadcrumb />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth={"xl"}>
              <Typography
                variant="h2"
                sx={{ flexGrow: 1, pt: 3, pl: 3, pr: 3 }}
              >
                {currentPageMessage === ""
                  ? returnTitleForDashboard(profile?.roles)
                  : currentPageMessage}
              </Typography>
              <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
                <Outlet />
              </Box>
            </Container>
          </Box>
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
