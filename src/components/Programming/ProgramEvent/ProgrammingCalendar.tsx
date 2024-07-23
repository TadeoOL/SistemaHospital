import { Box, Button, Card, CircularProgress, Modal, Typography } from '@mui/material';
import { CalendarComponent } from '../RegisterSteps/Calendar/CalendarComponent';
import { useMemo, useState } from 'react';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useGetDate } from '../../../hooks/programming/useGetDate';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { RegisterSteps } from '../RegisterSteps/RegisterSteps';
dayjs.locale('es');

export const ProgrammingCalendar = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const currentDate: any = dayjs(new Date());
  const setAppointmentStartDate = useProgrammingRegisterStore((state) => state.setAppointmentStartDate);
  const setAppointmentEndDate = useProgrammingRegisterStore((state) => state.setAppointmentEndDate);
  const events = useProgrammingRegisterStore((state) => state.events);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  const { isLoading } = useGetDate(date);

  const handleRegisterEvent = () => {
    setAppointmentStartDate(new Date());
    setAppointmentEndDate(new Date());
    setOpen(true);
  };

  const sameDate = useMemo(() => {
    if (!date) return true;
    const dateJs: any = dayjs(date);
    const formattedCurrentDate = currentDate['$M'] + currentDate['$y'];
    const formattedSelectedDate = dateJs['$M'] + dateJs['$y'];
    return formattedCurrentDate === formattedSelectedDate;
  }, [date]);

  if (isLoading && events.length < 1)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Card sx={{ px: 2, pt: 4, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Calendario</Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', columnGap: 1, px: 10 }}>
            <Box sx={{ display: 'flex' }}>
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
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  value={dayjs(date) ?? dayjs()}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          <Box sx={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
            <Button variant="contained" onClick={handleRegisterEvent}>
              Registrar evento
            </Button>
          </Box>
        </Box>
        <Box>
          <CalendarComponent
            date={date}
            events={events}
            calendarHeight={700}
            calendarWidth={'100%'}
            setDate={setDate}
            setEvents={setEvents}
          />
        </Box>
      </Card>
      <Modal open={open}>
        <>
          <RegisterSteps setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
