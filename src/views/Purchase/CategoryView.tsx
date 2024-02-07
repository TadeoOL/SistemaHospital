import { Box, Container } from "@mui/material";
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
      <Container maxWidth={"xl"}>
        <CategorysTabNav />
        {<Outlet />}
      </Container>
    </Box>
  );
};
