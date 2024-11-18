import { Modal, Box, Grid, Button, Typography, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';

const dietSchema = z.object({
  id_IngresoPaciente: z.string(),
  dieta: z.string().min(1, 'La dieta es requerida').max(500, 'La dieta no puede exceder los 500 caracteres'),
  dietaObservaciones: z.string().max(500, 'Las observaciones no pueden exceder los 500 caracteres').optional(),
});

export type DietFormData = z.infer<typeof dietSchema>;

interface AddPatientDietModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DietFormData) => void;
  id_IngresoPaciente: string;
}

export const AddPatientDietModal = ({ open, onClose, onSubmit, id_IngresoPaciente }: AddPatientDietModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DietFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      id_IngresoPaciente,
      dieta: '',
      dietaObservaciones: '',
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          boxShadow: 24,
        }}
      >
        <HeaderModal setOpen={onClose} title="Agregar Dieta" />

        <Box
          sx={{ bgcolor: 'background.paper', px: 3, py: 2, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              spacing={2}
              sx={{
                bgcolor: 'background.paper',
                p: 3,
              }}
            >
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={onClose} variant="outlined" color="error">
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};
