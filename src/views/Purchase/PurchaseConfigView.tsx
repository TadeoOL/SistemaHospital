import { Box, Container } from "@mui/material";
import { PurchaseConfig } from "../../components/Purchase/Authorization/Modal/PurchaseConfig";
export const PurchaseConfigView = () => {
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth="xl">
        <PurchaseConfig />
      </Container>
    </Box>
  );
};
