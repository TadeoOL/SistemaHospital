import { Box } from "@mui/material";
import { LoginComponent } from "../components/LoginComponent";

export const LoginView = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { lg: 10, xl: 25, sm: 15, xs:10 },
      }}
    >
      <LoginComponent />
    </Box>
  );
};
