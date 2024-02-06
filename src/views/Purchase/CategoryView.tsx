import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { CategorysTabNav } from "../../components/Purchase/Categorys/CategorysTabNav";

export const CategoryView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth={"xl"}>
        <CategorysTabNav />
        {<Outlet />}
      </Container>
    </Box>
  );
};
