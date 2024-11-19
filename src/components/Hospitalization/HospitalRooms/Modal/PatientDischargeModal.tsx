import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { SurgeryProceduresChip } from '../../../Commons/SurgeryProceduresChip';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHospitalRoomsPaginationStore } from '../../../../store/hospitalization/hospitalRoomsPagination';
import { useCreatePatientDischarge } from '../../../../hooks/hospitalization/useCreatePatientDischarge';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: '80%',
    md: '70%',
    lg: '60%',
  },
  maxHeight: {
    xs: '95vh',
    sm: '90vh',
  },
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  patientName: string;
  medicName: string;
  admissionReason: string;
  surgeries: string[];
  id_IngresoPaciente: string;
}

const formSchema = z.object({
  reason: z
    .string()
    .min(1, { message: 'El motivo de egreso es requerido' })
    .refine((value) => value !== 'default', {
      message: 'El motivo de egreso es requerido',
    }),
  observations: z.string().min(1, { message: 'Las observaciones son requeridas' }),
});

export type FormData = z.infer<typeof formSchema>;

const reasons = ['Mejora', 'Traslado', 'Defunción', 'Alta Voluntaria'];

export const PatientDischargeModal = ({
  setOpen,
  patientName,
  medicName,
  admissionReason,
  surgeries,
  id_IngresoPaciente,
}: Props) => {
  const fetch = useHospitalRoomsPaginationStore((state) => state.fetchData);
  const { mutate: createPatientDischarge } = useCreatePatientDischarge();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: 'default',
      observations: '',
    },
  });

  const onSubmit = (data: FormData) => {
    createPatientDischarge(
      {
        Id_IngresoPaciente: id_IngresoPaciente,
        DiagnosticoEgreso: data.reason,
        MotivoEgreso: data.observations,
      },
      {
        onSuccess: () => {
          setOpen(false);
          fetch();
        },
      }
    );
  };

  return (
    <Box sx={style}>
      <HeaderModal title="Alta médica" setOpen={setOpen} />
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(90vh - 64px)' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Nombre del paciente</Typography>
                <Typography>{patientName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Médico</Typography>
                <Typography>{medicName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Motivo de ingreso</Typography>
                <Typography>{admissionReason}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Cirugías</Typography>
                <SurgeryProceduresChip
                  surgeries={surgeries.map((surgery, i) => ({ id: i.toString(), nombre: surgery }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Motivo de Egreso</Typography>
                <TextField
                  select
                  fullWidth
                  label="Motivo de Egreso"
                  size="small"
                  value={watch('reason') || 'default'}
                  {...register('reason')}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                >
                  <MenuItem value="default" key="default" disabled>
                    Seleccione un motivo
                  </MenuItem>
                  {reasons.map((reason, i) => (
                    <MenuItem key={i} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Observaciones</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={3}
                  size="small"
                  {...register('observations')}
                  error={!!errors.observations}
                  helperText={errors.observations?.message}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: 'background.paper',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Confirmar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
