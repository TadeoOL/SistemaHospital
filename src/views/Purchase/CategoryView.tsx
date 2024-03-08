import { Box, Card, Container, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { CategorysTabNav } from "../../components/Purchase/Categorys/CategorysTabNav";
import { useEffect } from "react";
import { useCategoryTabNav } from "../../store/purchaseStore/categoryTabNav";

export const CategoryView = () => {
  const tabValue = useCategoryTabNav((state) => state.tabValue);
  const navigate = useNavigate();

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return navigate("categoria");
      case 1:
        return navigate("subcategoria");
      default:
        break;
    }
  }, [tabValue]);

  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Card sx={{ padding: "10px 20px 40px 10px" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "30px", marginTop: "25px", marginLeft: "15px" }}
        >
          Categorías y Sub Categorías
        </Typography>
        <Container maxWidth={"xl"}>
          <CategorysTabNav />
          {<Outlet />}
        </Container>
      </Card>
    </Box>
  );
};
