import {
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
  Box,
  // FormHelperText,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
interface ILogin {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const [text, setText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    navigate("/dashboard");
  };

  return (
    <Card
      sx={{
        justifyContent: "center",
        display: "flex",
        bgcolor: "#F5F5F5",
      }}
    >
      <Stack sx={{ flexDirection: "row" }}>
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "auto",
          }}
          src="https://play-lh.googleusercontent.com/xdTPpFriwvjDc1H8Ak45CJHoz_h0rm3OcrqBiQoa4gFBI1T4rGPLwy8fc3mpdSoXBepL"
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack sx={{ p: 2 }}>
            <Typography fontWeight={700} fontSize={28} sx={{ my: 8, mx: 4 }}>
              Inicia sesion en tu cuenta
            </Typography>
            <TextField
              error={!!errors.email}
              helperText={errors?.email?.message}
              {...register("email")}
              size="small"
              placeholder="Correo electronico"
              InputProps={{
                sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
              }}
            />
            <TextField
              error={!!errors.password}
              helperText={errors?.password?.message}
              {...register("password")}
              placeholder="Contraseña"
              size="small"
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setText(e.currentTarget.value);
              }}
              InputProps={{
                sx: { borderTopRightRadius: 0, borderTopLeftRadius: 0 },
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
            <Button
              type="submit"
              sx={{
                bgcolor: "#023e8a",
                "&:hover": { backgroundColor: "#03045e" },
                mt: 4,
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
      </Stack>
    </Card>
  );
};
