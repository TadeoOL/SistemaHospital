import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ArticleTabNav } from "../../components/Purchase/Articles/ArticleTabNav";

export const ArticleView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth={"xl"}>
        <ArticleTabNav />
        {<Outlet />}
      </Container>
    </Box>
  );
};
