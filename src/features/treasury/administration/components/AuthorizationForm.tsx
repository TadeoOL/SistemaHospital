import { InputBasic, SelectBasic } from '@/common/components';
import { useFormContext } from 'react-hook-form';
import { AuthorizationSchema } from '../schema/schema.administration';
import { Grid } from '@mui/material';
import { IConcept } from '../../types/types.common';

interface Props {
  concepts: IConcept[];
  fund: number;
}

export const AuthorizationForm = ({ concepts, fund }: Props) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<AuthorizationSchema>();

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SelectBasic
            label="Concepto de salida"
            value={watch('id_ConceptoSalida')}
            {...register('id_ConceptoSalida')}
            error={errors.id_ConceptoSalida?.message}
            helperText={errors.id_ConceptoSalida?.message}
            options={concepts.map((concept) => ({
              id: concept.id,
              nombre: concept.nombre,
            }))}
            uniqueProperty="id"
            displayProperty="nombre"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputBasic
            label="Cantidad"
            {...register('cantidad', { valueAsNumber: true })}
            error={errors.cantidad?.message}
            helperText={errors.cantidad?.message || `Fondo disponible: ${fund}`}
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
