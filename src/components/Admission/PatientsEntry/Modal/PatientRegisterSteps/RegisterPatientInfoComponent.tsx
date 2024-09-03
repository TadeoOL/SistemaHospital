import { Box, Button, Checkbox, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { patientModifySchema, patientRegistrationSchema } from '../../../../../schema/programming/programmingSchemas';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { IPatient } from '../../../../../types/types';
import { useEffect } from 'react';
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

type Inputs = IPatient & { sameAddress?: boolean };
interface PatientRegistrationFormProps {
  setOpen: Function;
  hospitalization?: boolean;
}
export const RegisterPatientInfoComponent = ({ setOpen, hospitalization }: PatientRegistrationFormProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const patient = usePatientEntryRegisterStepsStore((state) => state.patient);
  const setPatient = usePatientEntryRegisterStepsStore((state) => state.setPatient);
  const {
    secondLastName,
    lastName,
    genere,
    name,
    address,
    birthDate,
    city,
    civilStatus,
    neighborhood,
    occupation,
    personInCharge,
    personInChargeAddress,
    personInChargeNeighborhood,
    personInChargePhoneNumber,
    personInChargeZipCode,
    phoneNumber,
    relationship,
    state,
    zipCode,
  } = patient;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(hospitalization ? patientModifySchema : patientRegistrationSchema),
    defaultValues: {
      name,
      lastName,
      secondLastName,
      genere,
      birthDate: birthDate ?? new Date(),
      sameAddress: false,
      phoneNumber,
      relationship,
      state,
      city,
      neighborhood,
      occupation,
      personInCharge,
      personInChargePhoneNumber,
      personInChargeZipCode,
      zipCode,
      personInChargeAddress,
      personInChargeNeighborhood,
      address,
      civilStatus,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setPatient(data);
    setStep(step + 1);
    toast.success('Datos registrados correctamente');
  };

  const watchGenere = watch('genere');

  const watchAddresPersonInCharge = watch('personInChargeAddress');
  const watchPersonInChargeZipCode = watch('personInChargeZipCode');
  const watchPersonInChargeNeighborhood = watch('personInChargeNeighborhood');

  const watchSameAddress = watch('sameAddress');
  const watchZipCode = watch('zipCode');
  const watchNeighborhood = watch('neighborhood');
  const watchAddress = watch('address');

  useEffect(() => {
    if (watchSameAddress) {
      setValue('personInChargeAddress', watchAddress);
      setValue('personInChargeZipCode', watchZipCode);
      setValue('personInChargeNeighborhood', watchNeighborhood);
    }
  }, [watchSameAddress, watchZipCode, watchAddress, watchNeighborhood]);

  useEffect(() => {
    if (
      watchAddress &&
      watchAddresPersonInCharge &&
      watchNeighborhood &&
      watchPersonInChargeNeighborhood &&
      watchZipCode &&
      watchPersonInChargeZipCode &&
      watchAddresPersonInCharge === watchAddress &&
      watchNeighborhood === watchPersonInChargeNeighborhood &&
      watchZipCode === watchPersonInChargeZipCode
    ) {
      setValue('sameAddress', true);
    }
  }, [
    watchAddress,
    watchZipCode,
    watchNeighborhood,
    watchPersonInChargeNeighborhood,
    watchPersonInChargeZipCode,
    watchAddresPersonInCharge,
  ]);

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Alta de Paciente" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            p: 3,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: { xl: 700, xs: 500 },
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
            {hospitalization && (
              <>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Estado Civil</Typography>
                  <TextField
                    fullWidth
                    placeholder="Estado Civil..."
                    {...register('civilStatus')}
                    error={!!errors.civilStatus?.message}
                    helperText={errors.civilStatus?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Teléfono</Typography>
                  <TextField
                    fullWidth
                    placeholder="Teléfono..."
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber?.message}
                    helperText={errors.phoneNumber?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Ocupación/Empleo</Typography>
                  <TextField
                    fullWidth
                    placeholder="Escribe la ocupación..."
                    {...register('occupation')}
                    error={!!errors.occupation?.message}
                    helperText={errors.occupation?.message}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
                  <TextField
                    fullWidth
                    placeholder="Código Postal..."
                    {...register('zipCode')}
                    error={!!errors.zipCode?.message}
                    helperText={errors.zipCode?.message}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Colonia</Typography>
                  <TextField
                    fullWidth
                    placeholder="Colonia..."
                    {...register('neighborhood')}
                    error={!!errors.neighborhood?.message}
                    helperText={errors.neighborhood?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
                  <TextField
                    fullWidth
                    placeholder="Dirección..."
                    {...register('address')}
                    error={!!errors.address?.message}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Estado</Typography>
                  <TextField
                    fullWidth
                    placeholder="Estado..."
                    {...register('state')}
                    error={!!errors.state?.message}
                    helperText={errors.state?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Ciudad</Typography>
                  <TextField
                    fullWidth
                    placeholder="Ciudad..."
                    {...register('city')}
                    error={!!errors.city?.message}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ mt: 1, fontSize: 18, fontWeight: 500 }}>Datos de contacto</Typography>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Persona Responsable</Typography>
                  <TextField
                    fullWidth
                    placeholder="Nombre..."
                    {...register('personInCharge')}
                    error={!!errors.personInCharge?.message}
                    helperText={errors.personInCharge?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Parentesco</Typography>
                  <TextField
                    fullWidth
                    placeholder="Parentesco..."
                    {...register('relationship')}
                    error={!!errors.relationship?.message}
                    helperText={errors.relationship?.message}
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox {...register('sameAddress')} checked={watchSameAddress} />
                  <Typography sx={TYPOGRAPHY_STYLE}>Mismo Domicilio</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Código Postal</Typography>
                  <TextField
                    fullWidth
                    placeholder="Código postal..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeZipCode?.message}
                    helperText={errors.personInChargeZipCode?.message}
                    {...register('personInChargeZipCode')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Colonia</Typography>
                  <TextField
                    fullWidth
                    placeholder="Colonia..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeNeighborhood?.message}
                    helperText={errors.personInChargeNeighborhood?.message}
                    {...register('personInChargeNeighborhood')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
                  <TextField
                    fullWidth
                    placeholder="Dirección..."
                    disabled={watchSameAddress}
                    error={!!errors.personInChargeAddress?.message}
                    helperText={errors.personInChargeAddress?.message}
                    {...register('personInChargeAddress')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={TYPOGRAPHY_STYLE}>Teléfono</Typography>
                  <TextField
                    fullWidth
                    placeholder="Teléfono..."
                    error={!!errors.personInChargePhoneNumber?.message}
                    helperText={errors.personInChargePhoneNumber?.message}
                    {...register('personInChargePhoneNumber')}
                  />
                </Grid>
              </>
            )}
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
