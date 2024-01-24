import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { IUserSettings } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema } from "../../schema/schemas";
import { useAuthStore } from "../../store/auth";
import { toast } from "react-toastify";

export const AccountCard = () => {
  const user = useAuthStore((state) => state.profile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSettings>({
    defaultValues: {
      nombre: user?.nombre,
      apellidoPaterno: user?.apellidoPaterno,
      apellidoMaterno: user?.apellidoMaterno,
      imagenURL: user?.imagenURL,
      email: user?.email,
      telefono: user?.telefono,
    },
    resolver: zodResolver(userSettingsSchema),
  });

  return (
    <Box
      sx={{
        width: {
          lg: `calc(100% - 180px)`,
          md: `calc(100% - 140px)`,
          sm: `calc(100% - 100px)`,
          xs: `calc(100% -140px)`,
        },
        height: 1,
        boxShadow: 10,
        borderRadius: 2,
        display: "flex",
        flex: 1,
        p: 1,
        ml: { lg: 10, xs: 2 },
        mr: { xs: 2, md: 0 },
        mt: 4,
        minWidth: { xs: 0, md: 950 },
      }}
    >
      <Stack sx={{ p: 2, display: "flex", flex: 1 }}>
        <form onSubmit={() => {}} noValidate>
          <Stack>
            <Typography fontSize={24} fontWeight={700}>
              Informacion del perfil
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              sx={{ color: "neutral.400" }}
            >
              Actualiza tu informacion de usuario
            </Typography>
          </Stack>
          <Stack
            spacing={4}
            sx={{
              p: 4,
              flexDirection: { xs: "column", md: "row" },
              display: "flex",
              width: 1,
              flex: 1,
              alignItems: { xs: "center" },
              justifyContent: "space-between",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                width: { md: "50%" },
                display: "flex",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Avatar
                src={user?.imagenURL}
                sx={{
                  height: { xs: "154px", md: "220px" },
                  width: { xs: "154px", md: "220px" },
                }}
              />
              <Button variant="outlined" onClick={() => {}}>
                Cambiar foto de perfil
              </Button>
            </Stack>
            <Stack
              spacing={2}
              sx={{
                width: { md: "50%" },
                display: "flex",
                flex: 1,
                pr: { md: 8 },
              }}
            >
              <TextField
                error={!!errors.nombre}
                helperText={errors?.nombre?.message}
                {...register("nombre")}
                size="medium"
                label="Nombre"
              />
              <TextField
                error={!!errors.apellidoPaterno}
                helperText={errors?.apellidoPaterno?.message}
                {...register("apellidoPaterno")}
                size="medium"
                label="Apellido paterno"
              />
              <TextField
                error={!!errors.apellidoMaterno}
                helperText={errors?.apellidoMaterno?.message}
                {...register("apellidoMaterno")}
                size="medium"
                label="Apellido materno"
              />
              <TextField
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...register("email")}
                size="medium"
                label="Correo electrónico"
              />
              <TextField
                error={!!errors.telefono}
                helperText={errors?.telefono?.message}
                {...register("telefono")}
                size="medium"
                label="Telefono"
              />
            </Stack>
          </Stack>
          <Box>
            <Button
              variant="contained"
              onClick={() => toast("wwwoooooww")}
              size="small"
            >
              Guardar cambios
            </Button>
            {/* <ToastContainer /> */}
          </Box>
        </form>
      </Stack>
    </Box>
  );
};
