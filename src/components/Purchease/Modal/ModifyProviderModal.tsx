import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { IProvider } from "../../../types/types";
import { HeaderModal } from "../../Account/Modals/SubComponents/HeaderModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { addNewProviderSchema } from "../../../schema/schemas";
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

interface IModifyProviderModal {
  provider: IProvider | null;
}

export const ModifyProviderModal = (props: IModifyProviderModal) => {
  const {
    direccion,
    email,
    id,
    nombreCompania,
    nombreContacto,
    puesto,
    telefono,
  } = props.provider ?? {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProvider>({
    defaultValues: {
      nombreCompania: nombreCompania,
      nombreContacto: nombreContacto,
      puesto: puesto,
      direccion: direccion,
      telefono: telefono,
      email: email,
    },
    resolver: zodResolver(addNewProviderSchema),
  });

  const onSubmit: SubmitHandler<IProvider> = async (data) => {
    try {
      console.log(data);
      // api para modificar proveedor
      toast.success("Proveedor modificado correctamente!");
    } catch (error) {
      console.log(error);
      toast.error("Error al modificar proveedor!");
    }
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={() => {}} title="Modificar proveedor" />
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ p: 4, rowGap: 4 }}>
            <Typography fontWeight={700} fontSize={18}>
              Información del proveedor
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.nombreCompania}
                  helperText={errors?.nombreCompania?.message}
                  {...register("nombreCompania")}
                  label="Nombre compañía"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.nombreContacto}
                  helperText={errors?.nombreContacto?.message}
                  {...register("nombreContacto")}
                  label="Nombre contacto"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.puesto}
                  helperText={errors?.puesto?.message}
                  {...register("puesto")}
                  label="Puesto"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.direccion}
                  helperText={errors?.direccion?.message}
                  {...register("direccion")}
                  label="Dirección"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.telefono}
                  helperText={errors?.telefono?.message}
                  {...register("telefono")}
                  label="Teléfono"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  {...register("email")}
                  label="Correo electrónico"
                />
              </Grid>
            </Grid>
            <Stack
              sx={{
                flexDirection: "row",
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
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
    </Box>
  );
};
