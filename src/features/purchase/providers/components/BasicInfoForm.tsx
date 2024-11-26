import { Box, Grid, TextField, Typography } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { IProvider } from '../interfaces/providers.interface';

interface IBasicInfoForm {
  errors: FieldErrors<IProvider>;
  register: UseFormRegister<IProvider>;
}

export const BasicInfoForm = (props: IBasicInfoForm) => {
  const { errors, register } = props;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Nombre de la compañía</Typography>
        <TextField
          fullWidth
          error={!!errors.nombreCompania}
          helperText={errors?.nombreCompania?.message}
          {...register('nombreCompania')}
          placeholder="Nombre compañía"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Nombre del contacto</Typography>
        <TextField
          fullWidth
          error={!!errors.nombreContacto}
          helperText={errors?.nombreContacto?.message}
          {...register('nombreContacto')}
          placeholder="Nombre contacto"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Puesto</Typography>
        <TextField
          fullWidth
          error={!!errors.puesto}
          helperText={errors?.puesto?.message}
          {...register('puesto')}
          placeholder="Puesto"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Dirección</Typography>
        <TextField
          fullWidth
          error={!!errors.direccion}
          helperText={errors?.direccion?.message}
          {...register('direccion')}
          placeholder="Dirección"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Teléfono</Typography>
        <TextField
          fullWidth
          error={!!errors.telefono}
          helperText={errors?.telefono?.message}
          {...register('telefono')}
          placeholder="Teléfono"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle2">Correo electrónico</Typography>
        <TextField
          fullWidth
          error={!!errors.correoElectronico}
          helperText={errors?.correoElectronico?.message}
          {...register('correoElectronico')}
          placeholder="Correo electrónico"
        />
      </Grid>
    </Grid>
  );
};
