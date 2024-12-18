import { InputBasic, SelectBasic } from '@/common/components';
import { useFormContext } from 'react-hook-form';
import { AuthorizationSchema } from '../schema/schema.administration';
import { Grid } from '@mui/material';

export const AuthorizationForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuthorizationSchema>();
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SelectBasic
            label="Concepto de salida"
            {...register('id_ConceptoSalida')}
            error={errors.id_ConceptoSalida?.message}
            helperText={errors.id_ConceptoSalida?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputBasic
            label="Cantidad"
            {...register('cantidad', { valueAsNumber: true })}
            error={errors.cantidad?.message}
            helperText={errors.cantidad?.message}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputBasic
            label="Motivo"
            {...register('motivo')}
            multiline
            rows={4}
            error={errors.motivo?.message}
            helperText={errors.motivo?.message}
          />
        </Grid>
      </Grid>
    </form>
  );
};
