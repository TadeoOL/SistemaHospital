import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { CalendarComponent } from './Calendar/CalendarComponent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { toast } from 'react-toastify';
import { useGetDate } from '../../../hooks/programming/useGetDate';
import { useGetAllOperatingRooms } from '../../../hooks/operatingRoom/useGetAllOperatingRoom';
dayjs.locale('es');

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

interface CalendarRegisterProps {
  setOpen: Function;
  isOperatingRoomReservation?: boolean;
}

export const CalendarRegister = (props: CalendarRegisterProps) => {
  const { data, isLoading } = useGetAllOperatingRooms();
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const step = useProgrammingRegisterStore((state) => state.step);
  const [date, setDate] = useState<any>(dayjs());
  const currentDate: any = dayjs(new Date());
  const events = useProgrammingRegisterStore((state) => state.events);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  useGetDate(date, setEvents);
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);

  const sameDate = useMemo(() => {
    if (!date) return true;
    const formattedCurrentDate = currentDate['$M'] + currentDate['$y'] + currentDate['$D'];
    const formattedSelectedDate = date['$M'] + date['$y'] + date['$D'];
    return formattedCurrentDate === formattedSelectedDate;
  }, [date]);

  const handleNextStep = () => {
    if (roomValues.length < 1) return toast.warning('Para avanzar es necesario seleccionar un evento en el calendario');
    setStep(step + 1);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Disponibilidad de Agenda" />
      <Box
        sx={{
          flexDirection: 'column',
          p: 2,
          bgcolor: 'background.paper',
          overflowY: 'auto',
        }}
      >
        <Stack>
          <Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', columnGap: 1, px: 10, mb: 2 }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                {!sameDate && (
                  <Button variant="outlined" onClick={() => setDate(currentDate)} size="small">
                    <Typography sx={{ fontSize: 10, fontWeight: 500 }}>Volver al dia actual</Typography>
                  </Button>
                )}
              </Box>
              <Box sx={{ flex: 2 }}>
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
              {props.isOperatingRoomReservation && (
                <Box sx={{ flex: 1 }}>
                  <TextField select label="Quirófanos" fullWidth>
                    {isLoading ? (
                      <MenuItem>
                        <tr>Cargando...</tr>
                      </MenuItem>
                    ) : (
                      data.map((or) => (
                        <MenuItem key={or.id} value={or.id}>
                          {or.nombre}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Box>
              )}
            </Box>
          </Box>
          <CalendarComponent
            date={date}
            events={events}
            setDate={setDate}
            setEvents={setEvents}
            isOperatingRoomReservation={props.isOperatingRoomReservation}
          />
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
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};
