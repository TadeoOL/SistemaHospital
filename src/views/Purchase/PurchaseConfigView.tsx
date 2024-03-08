import { PurchaseConfig } from "../../components/Purchase/Authorization/Authorization/Modal/PurchaseConfig";
import { Box, Card, Container, Typography } from "@mui/material";
export const PurchaseConfigView = () => {
	return (
		<Box sx={{ p: 3, flexGrow: 1 }}>
			<Card sx={{ padding: "20px 20px 60px 20px" }}>
				<Typography
					variant="h4"
					sx={{ marginBottom: "20px", marginTop: "25px", marginLeft: "15px" }}
				>
					Configuración
				</Typography>
				<Container maxWidth="xl">
					<PurchaseConfig />
				</Container>
			</Card>
		</Box>
	);
};
