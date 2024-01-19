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
interface ILogin {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const setIsAuth = useIsAuthStore((state) => state.setIsAuth);
  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const method = "email";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<ILogin> = (data) => {
    console.log(data);
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
              <Tabs onChange={() => {}} sx={{ mb: 3 }} value={method}>
                <Tab label="Email" value="email" />
              </Tabs>
              <TextField
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                size="small"
                label="Correo electronico"
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
