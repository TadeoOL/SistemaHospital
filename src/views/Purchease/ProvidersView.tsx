import { Box, Container } from "@mui/material";
import { ProvidersCard } from "../../components/Purchease/ProvidersCard";

export const ProvidersView = () => {
  return (
    <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
      <Container maxWidth={"xl"}>
        <ProvidersCard />
      </Container>
    </Box>
  );
};
