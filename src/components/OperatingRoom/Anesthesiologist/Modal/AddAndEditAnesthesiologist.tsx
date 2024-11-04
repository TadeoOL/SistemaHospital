import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { IAnesthesiologist } from '../../../../types/hospitalizationTypes';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useAnesthesiologistPaginationStore } from '../../../../store/hospitalization/anesthesiologistPagination';
import {
  createAnesthesiologist,
  modifyAnesthesiologist,
} from '../../../../services/operatingRoom/anesthesiologistService';
import { anesthesiologistSchema } from '../../../../schema/hospitalization/hospitalizationSchema';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface AddAndEditAnesthesiologistProps {
  setOpen: Function;
  anesthesiologist?: IAnesthesiologist;
}

interface Inputs {
  id_Anestesiologo?: string;
  name: string;
  lastName: string;
  secondLastName: string;
  email: string;
  birthDate: Date | Dayjs;
  phoneNumber: string;
}

export const AddAndEditAnesthesiologist = (props: AddAndEditAnesthesiologistProps) => {
  const { anesthesiologist } = props;
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useAnesthesiologistPaginationStore((state) => state.fetchData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id_Anestesiologo: anesthesiologist?.id_Anestesiologo ?? '',
      name: anesthesiologist?.nombre ?? '',
      lastName: anesthesiologist?.apellidoPaterno ?? '',
      secondLastName: anesthesiologist?.apellidoMaterno ?? '',
      email: anesthesiologist?.email ?? '',
      birthDate: dayjs(anesthesiologist?.fechaNacimiento) ?? new Date(),
      phoneNumber: anesthesiologist?.telefono ?? '',
    },
    resolver: zodResolver(anesthesiologistSchema),
  });
  console.log({ anesthesiologist });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      anesthesiologist
        ? await modifyAnesthesiologist({
            id: data.id_Anestesiologo as string,
            nombre: data.name,
            apellidoPaterno: data.lastName,
            apellidoMaterno: data.secondLastName,
            email: data.email,
            fechaNacimiento: data.birthDate as Date,
            telefono: data.phoneNumber,
          })
        : await createAnesthesiologist({
            nombre: data.name,
            apellidoPaterno: data.lastName,
            apellidoMaterno: data.secondLastName,
            email: data.email,
            fechaNacimiento: data.birthDate as Date,
            telefono: data.phoneNumber,
          });
      toast.success(`Anestesiólogo ${anesthesiologist ? 'modificado' : 'agregado'} correctamente`);
      refetch();
      props.setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error al ${anesthesiologist ? 'modificar' : 'agregar'} el anestesiólogo.`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={style}>
      <HeaderModal
        setOpen={props.setOpen}
        title={props.anesthesiologist ? 'Modificar anestesiólogo' : 'Agregar anestesiólogo'}
      />
      <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
        <Box sx={{ bgcolor: 'background.paper', p: 2, display: 'flex' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Nombre</Typography>
              <TextField
                label="Escribe el nombre..."
                fullWidth
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Apellido paterno</Typography>
              <TextField
                label="Escribe el apellido paterno..."
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Apellido materno</Typography>
              <TextField
                label="Escribe el apellido materno..."
                fullWidth
                {...register('secondLastName')}
                error={!!errors.secondLastName?.message}
                helperText={errors.secondLastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Teléfono</Typography>
              <TextField
                label="Escribe el teléfono..."
                fullWidth
                {...register('phoneNumber')}
                error={!!errors.phoneNumber?.message}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Correo Electronico</Typography>
              <TextField
                label="Correo Electronico..."
                fullWidth
                {...register('email')}
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Fecha de nacimiento</Typography>
              <Controller
                name={'birthDate'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                      label="Fecha nacimiento"
                      onChange={onChange}
                      value={dayjs(value)}
                      format={'DD/MM/YYYY'}
                      disableFuture
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            p: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Button variant="outlined" color="error">
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={25} /> : 'Aceptar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
