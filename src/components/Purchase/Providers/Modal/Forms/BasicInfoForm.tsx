import { Box, Grid, TextField, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IProvider } from "../../../../../types/types";

interface IBasicInfoForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
}

export const BasicInfoForm = (props: IBasicInfoForm) => {
  const { errors, register } = props;
  return (
    <Box sx={{ rowGap: 2, display: "flex", flexDirection: "column" }}>
      <Typography fontWeight={700} fontSize={18}>
        Información general
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
    </Box>
  );
};
