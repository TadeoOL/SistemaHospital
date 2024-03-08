import { Box, Card, Container, Typography } from "@mui/material";
import { Warehouse } from "../../components/Purchase/Warehouse/Warehouse";

export const WarehouseView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Card sx={{ padding: "20px 20px 60px 20px" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "20px", marginTop: "25px", marginLeft: "15px" }}
        >
          Almacén
        </Typography>
        <Container maxWidth={"xl"}>
          <Warehouse />
        </Container>
      </Card>
    </Box>
  );
};
