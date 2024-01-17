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
import logoHSB from "../assets/logoHSB.png"
import { useIsAuthStore } from "../store/authentication";
interface ILogin {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const setIsAuth = useIsAuthStore((state) => state.setIsAuth)
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
    setIsAuth(true)
    navigate("/");
  };

  return (
    <Card
      sx={{
        justifyContent: "center",
        display: "flex",
        bgcolor: "white",
        borderRadius:5,
        boxShadow:10
      }}
    >
      <Stack sx={{ flexDirection: {xs:"stack", sm:"row"},display:"flex", alignItems:{xs:"center", sm:"normal"} }}>
        <Box
          component="img"
          sx={{
            height: { xs: "auto",},
            width: { sm: "auto", xs:"150px"},
            display:"flex",
            flex:1,
            borderRadius:{xs: 5, sm:0},
            mt:{xs:4, sm:0},
          }}
          src={logoHSB}
        />

        <Box sx={{display:"flex", flex:1}}> 
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack sx={{ p: 2 }}>
            <Typography fontWeight={700} fontSize={28} sx={{ my: 6, mx: 4 }}>
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
        </Box>
      </Stack>
    </Card>
  );
};
