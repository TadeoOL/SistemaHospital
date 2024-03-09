import { styled } from "@mui/material/styles";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";
import { useAppNavStore } from "../../store/appNav";
import CustomBreadcrumb from "./CustomBreadcrumb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Card, Typography, Container } from "@mui/material";

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

export const Layout: React.FC = () => {
	const isOpen = useAppNavStore((state) => state.open);
	const setIsOpen = useAppNavStore((state) => state.setOpen);
	const location = useLocation();
	const [currentPage, setCurrentPage] = useState<string>(location.pathname);

	const messagesByLink: Record<string, string> = {
		"/": "Inicio",
		"/compras/solicitud-compras/ordenes-compra": "Ordenes de Compra",
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
		"/compras/autorizacion-compras/autorizaciones": "Autorizaciones",
		"/compras/autorizacion-compras/historial-autorizaciones":
			"Historial de Autorizaciones",
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

	return (
		<>
			<TopNav toggleSidebar={toggleSidebar} currentPage={currentPage} />
			<SideNav />
			<LayoutRoot>
				<LayoutContainer>
					<CustomBreadcrumb />
					<Box sx={{ flexGrow: 1, p: 3 }}>
						<Container maxWidth={"xl"}>
							<Card>
								<Typography variant="h4" sx={{ flexGrow: 1, p: 3 }}>
									{currentPageMessage}
								</Typography>
								<Outlet />
							</Card>
						</Container>
					</Box>
				</LayoutContainer>
			</LayoutRoot>
		</>
	);
};
