import { Box, Container } from "@mui/material";
import { PurchaseAuthorization } from "../../components/Purchase/Authorization/PurchaseAuthorization";

export const PurchaseAuthorizationView = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl">
        <PurchaseAuthorization />
      </Container>
    </Box>
  );
};
