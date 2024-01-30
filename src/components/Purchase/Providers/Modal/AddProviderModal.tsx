import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { HeaderModal } from "../../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { IProvider } from "../../../../types/types";
import { addNewProviderSchema } from "../../../../schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, lg: 600 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  maxHeight: 600,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
  },
};

export const AddProviderModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProvider>({
    defaultValues: {
      nombreCompania: "",
      nombreContacto: "",
      puesto: "",
      direccion: "",
      telefono: "",
      email: "",
    },
    resolver: zodResolver(addNewProviderSchema),
  });

  const onSubmit: SubmitHandler<IProvider> = async (data) => {
    try {
      console.log(data);
      // api para registrar proveedor
      toast.success("Usuario agregado correctamente!");
    } catch (error) {
      console.log(error);
      toast.error("Error al agregar nuevo usuario!");
    }
  };

  return (
    <Box sx={{ ...style }}>
      <HeaderModal title="Agregar proveedor" setOpen={() => {}} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 2, px: 4 }}>
          <Stack spacing={2} sx={{ pr: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight={700} fontSize={18}>
                  Informacion del proveedor
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.nombreCompania}
                  helperText={errors?.nombreCompania?.message}
                  size="small"
                  {...register("nombreCompania")}
                  label="Nombre compañia"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.nombreContacto}
                  helperText={errors?.nombreContacto?.message}
                  size="small"
                  {...register("nombreContacto")}
                  label="Nombre contacto"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.puesto}
                  helperText={errors?.puesto?.message}
                  size="small"
                  {...register("puesto")}
                  label="Puesto"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.direccion}
                  helperText={errors?.direccion?.message}
                  size="small"
                  {...register("direccion")}
                  label="Direccion"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.telefono}
                  helperText={errors?.telefono?.message}
                  size="small"
                  {...register("telefono")}
                  label="Telefono"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  size="small"
                  {...register("email")}
                  label="Correo electronico"
                />
              </Grid>
            </Grid>
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button variant="outlined">Cancelar</Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
