import { Paper, Box, Grid } from "@mui/material";
import { LoginComponent } from "../components/Login/LoginComponent";
import logo from "../assets/cuadro-azul-logo.png";
import background from "../assets/quirofano1-fondo.png";
import { useTheme } from "@mui/material/styles";

export const LoginView = () => {
  const theme = useTheme();

  const paperStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    height: "100vh",
  };

  const boxContainer = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    [theme.breakpoints.between(0, 599)]: {
      width: "90%",
      height: "65vh",
      top: "40%",
    },
    [theme.breakpoints.between(600, 899)]: {
      width: "90%",
      height: "60vh",
      top: "40%",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "1024px",
      maxHeight: "70vh",
      width: "100%",
      height: "100%",
    },
    bgcolor: "background.paper",
    boxShadow: "20px 20px 30px 0px rgba(0, 0, 0, 0.3)",
    borderRadius: 0.5,
  };

  const logoStyle = {
    backgroundImage: `url(${logo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "70vh",
    color: "#f5f5f5",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "30%",
      maxWidth: "100%",
    },
    [theme.breakpoints.down("md")]: {
      maxHeight: "30%",
      maxWidth: "100%",
    },
  };

  const loginContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "-70vh",
    },
  };

  const loginStyle = {
    marginTop: "10vh",
    marginLeft: "10%",
    marginRight: "10%",
    [theme.breakpoints.down("sm")]: {
      marginTop: "-60vh",
      width: "300px",
    },
    [theme.breakpoints.between(600, 899)]: {
      marginTop: "-47vh",
    },
  };

  return (
    <Paper style={paperStyle}>
      <Box sx={boxContainer}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box sx={logoStyle} />
          </Grid>
          <Grid item xs={12} md={6} sx={loginContainerStyle}>
            <Box sx={loginStyle}>
              <LoginComponent />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
