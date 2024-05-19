import { Box, Button, Stack, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useHospitalizationRegisterStore } from '../../../store/hospitalization/hospitalizationRegister';
import { CalendarComponent } from './CalendarComponent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

interface CalenderRegisterProps {
  setOpen: Function;
}
export const CalenderRegister = (props: CalenderRegisterProps) => {
  const setStep = useHospitalizationRegisterStore((state) => state.setStep);
  const step = useHospitalizationRegisterStore((state) => state.step);
  const [date, setDate] = useState<any>(dayjs());
  const currentDate: any = dayjs(new Date());

  const sameDate = useMemo(() => {
    if (!date) return true;
    const formattedCurrentDate = currentDate['$M'] + currentDate['$y'];
    const formattedSelectedDate = date['$M'] + date['$y'];
    return formattedCurrentDate === formattedSelectedDate;
  }, [date]);

  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Disponibilidad de Agenda" />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          p: 2,
          bgcolor: 'background.paper',
          maxHeight: 750,
          overflowY: 'auto',
        }}
      >
        <Stack>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', columnGap: 1, px: 10 }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                {!sameDate && (
                  <Button variant="outlined" onClick={() => setDate(currentDate)} size="small">
                    <Typography sx={{ fontSize: 10, fontWeight: 500 }}>Volver al dia actual</Typography>
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    views={['year', 'month']}
                    label="Año y Mes"
                    onMonthChange={(e: any) => {
                      setDate(e);
                    }}
                    value={date ?? dayjs()}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
            <CalendarComponent date={date} />
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={() => setStep(step + 1)}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};
