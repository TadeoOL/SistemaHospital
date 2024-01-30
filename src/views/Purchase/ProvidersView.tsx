import { Box, Container } from "@mui/material";
import { ProvidersCard } from "../../components/Purchase/Providers/ProvidersCard";

export const ProvidersView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth={"xl"}>
        <ProvidersCard />
      </Container>
    </Box>
  );
};
