import { Box } from "@mui/material";
import { LoginComponent } from "../components/Login/LoginComponent";
import logo from "../assets/login-illustration.svg";

export const LoginView = () => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        width: 1,
        height: 1,
        alignItems: { xs: "center", md: "start" },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "50%",
          height: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box component="img" src={logo} />
      </Box>
      <LoginComponent />
    </Box>
  );
};
