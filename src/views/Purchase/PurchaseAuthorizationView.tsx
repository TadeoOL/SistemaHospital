import { Box, Container } from "@mui/material";
import { PurchaseAuthorization } from "../../components/Purchase/Authorization/PurchaseAuthorization";

export const PurchaseAuthorizationView = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <PurchaseAuthorization />
      </Container>
    </Box>
  );
};
