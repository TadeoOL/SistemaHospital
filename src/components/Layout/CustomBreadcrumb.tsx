import * as React from "react";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";
import { useLocation } from "react-router-dom";

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
	"/compras/categorias/categoria": "Categorías",
	"/compras/categorias/subcategoria": "Sub categorías",
	"/compras/articulos/articulo": "Catálogo de Artículos",
	"/compras/articulos/articulo-existente": "Artículos en Existencia",
	"/compras/almacen": "Almacén",
	"/compras/autorizacion-compras": "Autorización de ordenes de compra",
	"/compras/proveedores": "Proveedores",
	"/compras/configuracion-compras": "Configuración de compras",
	"/compras/autorizacion-compras/autorizaciones": "Autorizaciones",
	"/compras/autorizacion-compras/historial-autorizaciones":
		"Historial de Autorizaciones",
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
					<GrainIcon sx={{ mr: 0.5, fontSize: "22px" }} fontSize="inherit" />
					{currentPageMessage}
				</Typography>
			</Breadcrumbs>
		</div>
	);
};

export default CustomBreadcrumb;
