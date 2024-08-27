import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { patientRegistrationSchema } from '../../../../../schema/programming/programmingSchemas';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
dayjs.locale('es-MX');

// const CIVIL_STATUS = ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)'];
const GENERE = ['Hombre', 'Mujer'];
const TYPOGRAPHY_STYLE = { fontSize: 11, fontWeight: 500 };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};

const scrollBarStyle = {
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey',
  },
};

type Inputs = {
  name: string;
  lastName: string;
  secondLastName: string;
  genere: string;
  birthDate: Date;
};
interface PatientRegistrationFormProps {
  setOpen: Function;
}
export const RegisterPatientInfoComponent = (props: PatientRegistrationFormProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const patient = usePatientEntryRegisterStepsStore((state) => state.patient);
  const setPatient = usePatientEntryRegisterStepsStore((state) => state.setPatient);
  const { secondLastName, lastName, genere, name } = patient;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      name,
      lastName,
      secondLastName,
      genere,
      birthDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setPatient(data);
    setStep(step + 1);
    toast.success('Datos registrados correctamente');
  };

  const watchGenere = watch('genere');

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Alta de Paciente" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            p: 3,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: 700,
            ...scrollBarStyle,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Paciente</Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Nombre</Typography>
              <TextField
                fullWidth
                placeholder="Nombre..."
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Apellido Paterno</Typography>
              <TextField
                fullWidth
                placeholder="Apellido Paterno..."
                {...register('lastName')}
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Apellido Materno</Typography>
              <TextField
                fullWidth
                placeholder="Apellido Materno..."
                {...register('secondLastName')}
                error={!!errors.secondLastName?.message}
                helperText={errors.secondLastName?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Fecha Nacimiento</Typography>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                    <DatePicker
                      value={dayjs(value)}
                      onChange={onChange}
                      views={['year', 'month', 'day']}
                      disableFuture
                      format={'DD/MM/YYYY'}
                      label="Fecha de nacimiento"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Genero</Typography>
              <TextField
                fullWidth
                label="Selecciona el genero"
                select
                value={watchGenere}
                error={!!errors.genere?.message}
                helperText={errors.genere?.message}
                {...register('genere')}
              >
                {GENERE.map((genero) => (
                  <MenuItem key={genero} value={genero}>
                    {genero}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            bgcolor: 'background.paper',
            p: 1,
          }}
        >
          <Button variant="outlined" onClick={() => setStep(step - 1)}>
            Regresar
          </Button>
          <Button type="submit" variant="contained">
            Siguiente
          </Button>
        </Box>
      </form>
    </Box>
  );
};
