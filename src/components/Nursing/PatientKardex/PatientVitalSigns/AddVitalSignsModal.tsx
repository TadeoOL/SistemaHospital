import { Modal, Box, Typography, Grid, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { VitalSignsFormData, vitalSignsSchema } from '../../../../schema/nursing/vitalSignsSchema';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
dayjs.extend(localizedFormat);
dayjs.locale('es');

interface AddVitalSignsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VitalSignsFormData) => void;
  id_IngresoPaciente: string;
}

export const AddVitalSignsModal = ({ open, onClose, onSubmit, id_IngresoPaciente }: AddVitalSignsModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VitalSignsFormData>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: {
      id_IngresoPaciente,
      fechaSignosPaciente: new Date().toISOString(),
      tensionArterial: null,
      frecuenciaRespiratoriaFrecuenciaCardiaca: null,
      temperaturaCorporal: null,
      saturacionOxigeno: null,
      glicemia: null,
      estadoConciencia: null,
      escalaDolor: null,
    },
  });

  const estadosConciencia = ['Alerta', 'Somnoliento', 'Confuso', 'Estuporoso', 'Comatoso'];

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-vital-signs">
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
        <HeaderModal setOpen={onClose} title="Registrar Signos Vitales" />
        <Box
          sx={{ bgcolor: 'background.paper', px: 3, py: 2, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      type="number"
                      fullWidth
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      error={!!errors.tensionArterial}
                      helperText={errors.tensionArterial?.message}
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
                      value={field.value || ''}
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
                      value={field.value || ''}
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
                      value={field.value || ''}
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
                      value={field.value || ''}
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
                      select
                      fullWidth
                      value={field.value || ''}
                      error={!!errors.estadoConciencia}
                      helperText={errors.estadoConciencia?.message}
                    >
                      {estadosConciencia.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                          {estado}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      error={!!errors.escalaDolor}
                      helperText={errors.escalaDolor?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
