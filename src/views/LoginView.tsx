import { Container } from "@mui/material";
import { LoginComponent } from "../components/LoginComponent";

export const LoginView = () => {
  return (
    <Container
      maxWidth={"xl"}
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { lg: 10, xl: 25 },
      }}
    >
      <LoginComponent />
    </Container>
  );
};
