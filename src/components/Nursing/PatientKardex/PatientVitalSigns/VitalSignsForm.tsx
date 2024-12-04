import { Typography, Grid, Button, TextField, Card, CardContent, CardActions } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VitalSignsFormData, vitalSignsSchema } from '../../../../schema/nursing/vitalSignsSchema';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(localizedFormat);
dayjs.locale('es');

interface VitalSignsFormProps {
  initialData?: VitalSignsFormData;
  onSubmit: (data: VitalSignsFormData) => void;
}

export const VitalSignsForm = ({ initialData, onSubmit }: VitalSignsFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VitalSignsFormData>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: initialData || {
      fechaSignosPaciente: new Date().toISOString(),
      tensionArterial: '',
      frecuenciaRespiratoriaFrecuenciaCardiaca: null,
      temperaturaCorporal: null,
      saturacionOxigeno: null,
      glicemia: null,
      estadoConciencia: null,
      escalaDolor: null,
    },
  });

  return (
    <Card sx={{ mx: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="vital-signs-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                <Typography variant="subtitle2" gutterBottom>
                  Fecha y Hora de Registro
                </Typography>
                <Controller
                  name="fechaSignosPaciente"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.toISOString() : null);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.fechaSignosPaciente,
                          helperText: errors.fechaSignosPaciente?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Tensión Arterial (mmHg)
              </Typography>
              <Controller
                name="tensionArterial"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    value={typeof field.value === 'number' ? (field.value as number).toString() : field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors.tensionArterial}
                    helperText={errors.tensionArterial?.message as string}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Frecuencia Cardíaca (lpm)
              </Typography>
              <Controller
                name="frecuenciaRespiratoriaFrecuenciaCardiaca"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    value={Number(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    error={!!errors.frecuenciaRespiratoriaFrecuenciaCardiaca}
                    helperText={errors.frecuenciaRespiratoriaFrecuenciaCardiaca?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Temperatura Corporal (°C)
              </Typography>
              <Controller
                name="temperaturaCorporal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    value={Number(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    error={!!errors.temperaturaCorporal}
                    helperText={errors.temperaturaCorporal?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Saturación de Oxígeno (%)
              </Typography>
              <Controller
                name="saturacionOxigeno"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    value={Number(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    error={!!errors.saturacionOxigeno}
                    helperText={errors.saturacionOxigeno?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Glicemia (mg/dL)
              </Typography>
              <Controller
                name="glicemia"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    value={Number(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    error={!!errors.glicemia}
                    helperText={errors.glicemia?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Estado de Conciencia
              </Typography>
              <Controller
                name="estadoConciencia"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ''}
                    error={!!errors.estadoConciencia}
                    helperText={errors.estadoConciencia?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Escala de Dolor (0-10)
              </Typography>
              <Controller
                name="escalaDolor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    value={Number(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    error={!!errors.escalaDolor}
                    helperText={errors.escalaDolor?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button type="submit" variant="contained" form="vital-signs-form">
          Guardar
        </Button>
      </CardActions>
    </Card>
  );
};
