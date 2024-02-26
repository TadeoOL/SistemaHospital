import { Paper, Box, Grid } from "@mui/material";
import { LoginComponent } from "../components/Login/LoginComponent";
import logo from "../assets/cuadro-azul-logo.png";
import background from "../assets/quirofano1-fondo.png";
import { useTheme } from '@mui/material/styles';
import "./LoginView.css";

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
    [theme.breakpoints.down('sm')]: {
      width: "60%",
      height: "55vh",
      top: "40%"
    },
    [theme.breakpoints.down('md')]: {
      width: "90%",
      height: "60vh",
      top: "40%"
    },
    height: "70vh",
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
  };

  const loginStyle = {
    marginTop: "10vh",
    marginLeft: "10%",
    marginRight: "10%"
  };

  return (
    <Paper style={paperStyle}>
      <Box sx={boxContainer}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box sx={logoStyle} className="logoContainer" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={loginStyle}>
              <LoginComponent />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
