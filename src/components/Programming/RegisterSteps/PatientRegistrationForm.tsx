import { Box, Button, Checkbox, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientRegistrationSchema } from '../../../schema/programming/programmingSchemas';

// const CIVIL_STATUS = ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)'];
const GENERE = ['Hombre', 'Mujer'];
const TYPOGRAPHY_STYLE = { fontSize: 11, fontWeight: 500 };

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
  age: string;
  genere: string;
  civilStatus: string;
  phoneNumber: string;
  occupation: string;
  zipCode: string;
  neighborhood: string;
  address: string;
  personInCharge: string;
  relationship: string;
  sameAddress: boolean;
  personInChargeZipCode: string;
  personInChargeNeighborhood: string;
  personInChargeAddress: string;
  personInChargePhoneNumber: string;
};

export const PatientRegistrationForm = () => {
  const step = useProgrammingRegisterStore((state) => state.step);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const [genereSelected, setGenereSelected] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(patientRegistrationSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log({ data });
    setStep(step + 1);
  };

  const watchSameAddress = watch('sameAddress');
  const watchZipCode = watch('zipCode');
  const watchNeighborhood = watch('neighborhood');
  const watchAddress = watch('address');

  useEffect(() => {
    if (watchSameAddress) {
      setValue('personInChargeAddress', watchAddress);
      setValue('personInChargeNeighborhood', watchNeighborhood);
      setValue('personInChargeZipCode', watchZipCode);
    } else {
      setValue('personInChargeZipCode', '');
      setValue('personInChargeNeighborhood', '');
      setValue('personInChargeAddress', '');
    }
  }, [watchSameAddress, watchZipCode, watchNeighborhood, watchAddress]);

  return (
    <>
      <HeaderModal setOpen={() => {}} title="Alta de Paciente" />
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
              <Typography sx={TYPOGRAPHY_STYLE}>Edad</Typography>
              <TextField
                fullWidth
                placeholder="Edad..."
                {...register('age')}
                error={!!errors.age?.message}
                helperText={errors.age?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={TYPOGRAPHY_STYLE}>Genero</Typography>
              <TextField
                fullWidth
                label="Selecciona el genero"
                select
                value={genereSelected}
                error={!!errors.genere?.message}
                helperText={errors.genere?.message}
                {...register('genere')}
                onChange={(e) => setGenereSelected(e.target.value)}
              >
                {GENERE.map((genero) => (
                  <MenuItem key={genero} value={genero}>
                    {genero}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={7}>
              <Typography sx={TYPOGRAPHY_STYLE}>Dirección</Typography>
              <TextField
                fullWidth
                placeholder="Dirección..."
                {...register('address')}
                error={!!errors.address?.message}
                helperText={errors.address?.message}
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
              <Checkbox {...register('sameAddress')} />
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
          <Button variant="contained" onClick={() => setStep(step - 1)}>
            Regresar
          </Button>
          <Button type="submit" variant="contained">
            Siguiente
          </Button>
        </Box>
      </form>
    </>
  );
};
