import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { login } from "../../api/api.routes";
import { IUser } from "../../types/types";
import { useAuthStore } from "../../store/auth";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

interface ILogin {
  userName: string;
  password: string;
}

export const LoginComponent = () => {
  const theme = useTheme();
  const setToken = useAuthStore((state) => state.setToken);
  const setProfile = useAuthStore((state) => state.setProfile);
  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: {
      userName: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    try {
      setIsLoading(true);
      const user: IUser = await login(data.userName, data.password);
      setToken(user.token);
      setProfile(user);
      toast.done("Inicio de sesion correcto!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Credenciales incorrectas!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setValue("password", passwordValue);
    setText(passwordValue);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack>
          <Typography fontWeight={700} fontSize={24}>
            Iniciar sesión
          </Typography>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            spacing={2}
          >
            <Tabs value={"email"} variant="fullWidth">
              <Tab label="Inicio de Sesión" value="email" />
              <Tab label="Recuperar Usuario" value="" />
            </Tabs>
            <TextField
              error={!!errors.userName}
              helperText={errors?.userName?.message}
              {...register("userName")}
              label="Nombre de usuario"
            />
            <TextField
              error={!!errors.password}
              helperText={errors?.password?.message}
              {...register("password")}
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {text.trim() === "" ? null : (
                      <IconButton
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Button
            fullWidth
            type="submit"
            sx={{
              marginTop: "2%",
              bgcolor: "#023e8a",
              "&:hover": { backgroundColor: "#03045e" },
              [theme.breakpoints.down("sm")]: {
                marginTop: "4%",
                marginLeft: "8%",
              },
              [theme.breakpoints.between(600, 899)]: {
                marginTop: "2%",
              },
            }}
          >
            {!isLoading ? (
              <Typography
                color="white"
                fontWeight={500}
                fontSize={14}
                sx={{ mt: "2%", mb: "2%" }}
              >
                Iniciar sesion
              </Typography>
            ) : (
              <CircularProgress />
            )}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
