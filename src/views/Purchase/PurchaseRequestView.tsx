import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PurchaseTabNav } from "../../components/Purchase/PurchaseRequest/SubComponents/PurchaseTabNav";

export const PurchaseRequestView = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl">
        <PurchaseTabNav />
        <Box
          sx={{
            boxShadow: 10,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflowX: "auto",
            bgcolor: "white",
          }}
        >
          {<Outlet />}
        </Box>
      </Container>
    </Box>
  );
};
