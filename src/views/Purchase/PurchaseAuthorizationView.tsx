import { Box, Card, Container, Typography } from "@mui/material";
import { PurchaseAuthorization } from "../../components/Purchase/Authorization/PurchaseAuthorization";

export const PurchaseAuthorizationView = () => {
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
          <PurchaseAuthorization />
        </Container>
      </Card>
    </Box>
  );
};
