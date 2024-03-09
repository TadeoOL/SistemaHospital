import { AuthorizationTabNav } from "../../components/Purchase/Authorization/AuthorizationTabNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthorizationTabNav } from "../../store/purchaseStore/authorizationTabNav";
import { useEffect } from "react";
import { Container } from "@mui/material";

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
		<Container maxWidth="xl">
			<AuthorizationTabNav />
			{<Outlet />}
		</Container>
	);
};
