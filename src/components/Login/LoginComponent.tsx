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
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
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
  const { setUser } = useUserInfoStore((state) => ({
    setUser: state.setUser,
  }));
  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    const formData = getValues(); // Obtén los valores del formulario
    console.log("Form Data (before handleSubmit):", formData);
    const user: IUser = await login(data.userName, data.password);
    if (!user) return;
    console.log({ user });
    setUser(user);
    setIsAuth(true);
    navigate("/");
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setValue("password", passwordValue);
    setText(passwordValue);
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
