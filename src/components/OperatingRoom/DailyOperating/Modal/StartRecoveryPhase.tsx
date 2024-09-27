import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { useGetAllNursesUsers } from '../../../../hooks/hospitalization/useGetAllNurse';
import { SubmitHandler, useForm } from 'react-hook-form';
import { startRecoveryPhaseSchema } from '../../../../schema/operatingRoom/operatingRoomSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { modifyOperatingRoomRegister } from '../../../../services/operatingRoom/operatingRoomRegisterService';
import { useDailyOperatingRoomsPaginationStore } from '../../../../store/operatingRoom/dailyOperatingRoomsPagination';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 370, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};
interface Inputs {
  nurse: { id_Enfermero: string; nombre: string } | null;
  startTime: string | Date;
}
export const StartRecoveryPhase = (props: { setOpen: Function; operatingRoomId: string; surgeryEndTime: Date }) => {
  const { isLoadingNursesUsers, nursesUsersData } = useGetAllNursesUsers();
  const refetch = useDailyOperatingRoomsPaginationStore((state) => state.fetchData);
  const {
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: { nurse: null, startTime: props.surgeryEndTime },
    resolver: zodResolver(startRecoveryPhaseSchema),
  });
  const watchDay = watch('startTime');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (dayjs(data.startTime).isBefore(props.surgeryEndTime)) {
      return Swal.fire({
        title: 'Advertencia',
        text: 'La hora de inicio de recuperación no puede ser anterior a la hora de finalización de la operación.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    withReactContent(Swal)
      .fire({
        title: 'Comienzo de recuperación',
        html: `¿Está seguro que desea comenzar la recuperación? </br></br> <b>La recuperación comenzará a las:</b></br> <h1>${dayjs(data.startTime).format('DD/MM/YYYY - HH:mm')}</h1>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await modifyOperatingRoomRegister({
              id_RegistroQuirofano: props.operatingRoomId,
              Enfermero: data.nurse ?? undefined,
              horaInicioRecuperacion: new Date(data.startTime),
            });
            Swal.fire({
              title: 'Recuperación comenzada',
              text: 'La recuperación a iniciado con éxito.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            refetch();
            props.setOpen(false);
          } catch (error) {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al iniciar la recuperación.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        } else {
          Swal.fire({
            title: 'Cancelado',
            text: 'La recuperación no se ha iniciado.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
  };
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Comienzo de recuperación" />
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4">¿Está seguro que desea comenzar la recuperación?</Typography>
        <Typography>
          Para poder iniciar la recuperación del paciente es necesario asignarle un enfermero a cargo, y la hora que
          inicio la recuperación.
        </Typography>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, mt: 2 }}>
            <Box>
              <Typography>Enfermero a cargo:</Typography>
              <Autocomplete
                loading={isLoadingNursesUsers}
                options={nursesUsersData}
                noOptionsText="No se encontraron enfermeros"
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id_Enfermero === value.id_Enfermero}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enfermeros"
                    error={!!errors.nurse?.message}
                    helperText={errors.nurse?.message}
                  />
                )}
                onChange={(_, value) => setValue('nurse', value)}
                value={watch('nurse')}
              />
            </Box>
            <Box>
              <Typography>Hora de inicio de recuperación:</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Fecha y Hora"
                  value={dayjs(watchDay)}
                  onChange={(newValue) => setValue('startTime', dayjs(newValue).format('YYYY-MM-DDTHH:mm'))}
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </form>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          p: 1,
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" form="form" type="submit">
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};
