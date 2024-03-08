import { Box, Card, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ArticleTabNav } from "../../components/Purchase/Articles/ArticleTabNav";

export const ArticleView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Card sx={{ padding: "10px 20px 40px 10px" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "30px", marginTop: "25px", marginLeft: "15px" }}
        >
          Artículos
        </Typography>
        <Container maxWidth={"xl"}>
          <ArticleTabNav />
          {<Outlet />}
        </Container>
      </Card>
    </Box>
  );
};
