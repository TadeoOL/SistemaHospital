import { Box, Container } from "@mui/material";
import { PurchaseRequestCard } from "../../components/Purchase/PurchaseRequest/PurchaseRequestCard";

export const PurchaseRequestView = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl">
        <PurchaseRequestCard />
      </Container>
    </Box>
  );
};
