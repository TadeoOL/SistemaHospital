import * as React from "react";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";
import { useLocation } from "react-router-dom";
import { Box, Container } from "@mui/material";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const messagesByLink: Record<string, string> = {
  "/": "Inicio",
  "/compras/solicitud-compras": "Solicitud de compras",
  "/compras/solicitud-compras/productos-solicitados-orden-compra":
    "Solcitudes en Proceso",
  "/compras/solicitud-compras/productos-stock-bajo": "Alerta de Productos",
  "/compras/categorias/categoria": "Categoría",
  "/compras/categorias/subcategoria": "Sub categoría",
  "/compras/articulos/articulo": "Catálogo de Productos",
  "/compras/articulos/articulo-existente": "Productos en Existencia",
  "/compras/almacen": "Almacén",
  "/compras/autorizacion-compras": "Autorización de ordenes de compra",
  "/compras/proveedores": "Proveedores",
  "/compras/configuracion-compras": "Configuración de compras",
};

const CustomBreadcrumb = () => {
  const location = useLocation();
  const [currentPageMessage, setCurrentPageMessage] = useState<string>("");

  useEffect(() => {
    const currentMessage = messagesByLink[location.pathname] || "";
    setCurrentPageMessage(currentMessage);
  }, [location.pathname]);

  return (
    <div role="presentation" onClick={handleClick}>
      <Box component="main" sx={{ pt: 3, pl: 3, flexGrow: 1 }}>
        <Container maxWidth={"xl"}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
                fontWeight: 600,
              }}
              color="inherit"
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: "22px" }} fontSize="inherit" />
              Inicio
            </Typography>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
                fontWeight: 600,
              }}
              color="text.primary"
            >
              <GrainIcon
                sx={{ mr: 0.5, fontSize: "22px" }}
                fontSize="inherit"
              />
              {currentPageMessage}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>
    </div>
  );
};

export default CustomBreadcrumb;
