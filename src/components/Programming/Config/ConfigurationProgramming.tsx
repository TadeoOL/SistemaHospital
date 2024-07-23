import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { modifyModuleConfig } from '../../../api/api.routes';
import { useEffect, useState } from 'react';
import { getAdmissionConfig } from '../../../services/programming/configAdmissionService';
import { parseDuration } from '../../../utils/admission/admissionUtils';
interface Inputs {
  timeRooms: Dayjs;
  timeOperatingRooms: Dayjs;
}

const useGetConfig = () => {
  const [data, setData] = useState<{ timeRooms: string; timeOperatingRooms: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAdmissionConfig();
        setData({
          timeRooms: res.duracionLimpiezaCuarto,
          timeOperatingRooms: res.duracionLimpiezaQuirofano,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { isLoading, data };
};
export const ConfigurationProgramming = () => {
  const { isLoading, data } = useGetConfig();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      timeOperatingRooms: dayjs().hour(0).minute(0),
      timeRooms: dayjs().hour(0).minute(0),
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const roomTime = data.timeRooms.format('00:HH:mm:00');
    const operatingRoomTime = data.timeOperatingRooms.format('00:HH:mm:00');

    const configModule = {
      DuracionLimpiezaCuarto: roomTime,
      DuracionLimpiezaQuirofano: operatingRoomTime,
    };
    try {
      await modifyModuleConfig(configModule, 'Admision');
      toast.success('Configuración modificada con éxito!');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const timeRooms = parseDuration(data?.timeRooms as string);
    const timeOperatingRooms = parseDuration(data?.timeOperatingRooms as string);

    setValue('timeRooms', timeRooms);
    setValue('timeOperatingRooms', timeOperatingRooms);
  }, [data, isLoading]);

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        display: 'flex',
        borderRadius: 5,
        boxShadow: 10,
        width: { xs: 300, sm: 700 },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Configuración de Admisión</Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ alignItems: 'flex-end', display: 'flex' }}>
            <Box>
              <Typography>Espacio entre reservaciones de cuartos:</Typography>
              <Controller
                control={control}
                name="timeRooms"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      ampm={false}
                      view="minutes"
                      views={['minutes']}
                      label="Margen de reservación"
                      onChange={onChange}
                      value={value}
                      slotProps={{
                        textField: {
                          helperText: 'El tiempo esta representado en minutos.',
                          error: !!errors.timeRooms?.message,
                          sx: {
                            '.MuiFormHelperText-root': {
                              color: 'error.main',
                              fontSize: 11,
                              fontWeight: 700,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ alignItems: 'flex-end', display: 'flex' }}>
            <Box>
              <Typography>Espacio entre reservaciones de quirófanos:</Typography>
              <Controller
                control={control}
                name="timeOperatingRooms"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      ampm={false}
                      view="minutes"
                      views={['hours', 'minutes']}
                      label="Margen de reservación"
                      onChange={onChange}
                      value={value}
                      maxTime={dayjs().set('hour', 3).set('minute', 55)}
                      disableFuture={false}
                      slotProps={{
                        textField: {
                          helperText: 'El tiempo esta representado en minutos.',
                          error: !!errors.timeOperatingRooms?.message,
                          sx: {
                            '.MuiFormHelperText-root': {
                              color: 'error.main',
                              fontSize: 11,
                              fontWeight: 700,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit">
              Aplicar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
