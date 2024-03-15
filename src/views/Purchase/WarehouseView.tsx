import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export const WarehouseView = () => {
  return (
    <Box>
      <Container maxWidth={"xl"}>
        <Outlet />
      </Container>
    </Box>
  );
};
