import { Grid, Button, Typography, TextField, Card, CardContent, CardActions } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const dietSchema = z.object({
  id_IngresoPaciente: z.string().optional(),
  dieta: z.string().min(1, 'La dieta es requerida').max(500, 'La dieta no puede exceder los 500 caracteres'),
  dietaObservaciones: z.string().max(500, 'Las observaciones no pueden exceder los 500 caracteres').optional(),
});

export type DietFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
  initialData?: DietFormData;
  onSubmit: (data: DietFormData) => void;
}

export const DietForm = ({ initialData, onSubmit }: DietFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DietFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: initialData || {
      dieta: '',
      dietaObservaciones: '',
    },
  });

  return (
    <Card sx={{ mx: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="diet-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Dieta
              </Typography>
              <Controller
                name="dieta"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.dieta}
                    helperText={errors.dieta?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Observaciones
              </Typography>
              <Controller
                name="dietaObservaciones"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.dietaObservaciones}
                    helperText={errors.dietaObservaciones?.message}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button type="submit" variant="contained" form="diet-form">
          Guardar
        </Button>
      </CardActions>
    </Card>
  );
};
