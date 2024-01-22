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
  // FormHelperText,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
// import logoHSB from "../assets/logoHSB.png";
import { useIsAuthStore } from "../../store/authentication";
import { login } from "../../api/api.routes";
import { useUserInfoStore } from "../../store/user";
import { IUser } from "../../types/types";
interface ILogin {
  userName: string;
  password: string;
}

export const LoginComponent = () => {
  const setIsAuth = useIsAuthStore((state) => state.setIsAuth);
  const {
    setNombre,
    setApellidoPaterno,
    setApellidoMaterno,
    setTelefono,
    setEmail,
    setImagenURL,
  } = useUserInfoStore((state) => ({
    setNombre: state.setNombre,
    setApellidoPaterno: state.setApellidoPaterno,
    setApellidoMaterno: state.setApellidoMaterno,
    setTelefono: state.setTelefono,
    setEmail: state.setEmail,
    setImagenURL: state.setImagenURL,
  }));

  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: {
      userName: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const user: IUser = await login(data.userName, data.password);
    if (!user) return;
    console.log({ user });
    console.log("Setting nombre:", user.nombre);
    console.log("Setting apellidoPaterno:", user.apellidoPaterno);
    console.log("Setting apellidoMaterno:", user.apellidoMaterno);
    console.log("Setting telefono:", user.telefono);
    console.log("Setting email:", user.email);
    console.log("Setting imagenURL:", user.imagenURL);
    setNombre(user.nombre);
    setApellidoPaterno(user.apellidoPaterno);
    setApellidoMaterno(user.apellidoMaterno);
    setTelefono(user.telefono);
    setEmail(user.email);
    setImagenURL(user.imagenURL);
    setIsAuth(true);
    navigate("/");
  };

  return (
    <Box
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        width: "50%",
        height: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: 1,
          flexDirection: "column",
          p: { lg: 20, sm: 10, xl: 30 },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack sx={{ display: "flex" }} spacing={4}>
            <Typography fontWeight={700} fontSize={28}>
              Iniciar sesion
            </Typography>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                width: 1,
              }}
              spacing={2}
            >
              <Tabs sx={{ mb: 3 }} value={"email"}>
                <Tab label="Nombre de usuario" value="email" />
              </Tabs>
              <TextField
                error={!!errors.userName}
                helperText={errors?.userName?.message}
                {...register("userName")}
                size="small"
                label="Nombre de usuario"
              />
              <TextField
                error={!!errors.password}
                helperText={errors?.password?.message}
                {...register("password")}
                label="Contraseña"
                size="small"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setText(e.currentTarget.value);
                }}
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
              type="submit"
              sx={{
                bgcolor: "#023e8a",
                "&:hover": { backgroundColor: "#03045e" },
              }}
            >
              <Typography
                color="white"
                fontWeight={500}
                fontSize={14}
                sx={{ p: 1 }}
              >
                Iniciar sesion
              </Typography>
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
