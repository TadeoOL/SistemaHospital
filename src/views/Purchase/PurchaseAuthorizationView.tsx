import { AuthorizationTabNav } from "../../components/Purchase/Authorization/AuthorizationTabNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthorizationTabNav } from "../../store/purchaseStore/authorizationTabNav";
import { useEffect } from "react";
import { Box, Card, Container, Typography } from "@mui/material";

export const PurchaseAuthorizationView = () => {
	const tabValue = useAuthorizationTabNav((state) => state.tabValue);
	const navigate = useNavigate();

	useEffect(() => {
		switch (tabValue) {
			case 0:
				return navigate("autorizaciones");
			case 1:
				return navigate("historial-autorizaciones");
			default:
				break;
		}
	}, [tabValue]);

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Card sx={{ padding: "20px 20px 60px 20px" }}>
				<Typography
					variant="h4"
					sx={{ marginBottom: "20px", marginTop: "25px", marginLeft: "15px" }}
				>
					Autorizaciones
				</Typography>
				<Container maxWidth="xl">
					<AuthorizationTabNav />
					{<Outlet />}
				</Container>
			</Card>
		</Box>
	);
};
