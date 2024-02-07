import { Box, Container } from "@mui/material";
import { Warehouse } from "../../components/Purchase/Warehouse/Warehouse";

export const WarehouseView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth={"xl"}>
        <Warehouse />
      </Container>
    </Box>
  );
};
