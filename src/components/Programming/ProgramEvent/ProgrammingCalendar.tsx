import { Box, Card, CircularProgress, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { CalendarComponent } from '../RegisterSteps/Calendar/CalendarComponent';
import { useState } from 'react';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useGetDate } from '../../../hooks/programming/useGetDate';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useGetAllTypesRoom } from '../../../hooks/programming/useGetAllTypesRoom';
import { useGetAllRooms } from '../../../hooks/programming/useGetAllRooms';
import { ClearAll } from '@mui/icons-material';
dayjs.locale('es');

export const ProgrammingCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomId, setRoomId] = useState('');
  const events = useProgrammingRegisterStore((state) => state.events);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  useGetDate(date, setEvents, roomTypeId, roomId);
  const { data, isLoadingTypeRoom } = useGetAllTypesRoom();
  const { data: roomsData, isLoadingRooms } = useGetAllRooms(roomTypeId);

  const handleClearFilters = () => {
    setRoomTypeId('');
    setRoomId('');
    setDate(new Date());
  };

  if (isLoadingTypeRoom || isLoadingRooms)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Card sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, flex: 1 }}>Calendario de Espacios Reservados</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { sm: 'end', xs: undefined },
          mb: 3,
          columnGap: 4,
          px: { sm: 10, xs: 4 },
          py: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ flex: 0.5 }}>
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
                  variant: 'standard',
                },
              }}
              value={dayjs(date) ?? dayjs()}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            fullWidth
            label="Tipo de Espacio"
            size="small"
            variant="standard"
            value={roomTypeId}
            onChange={(e) => setRoomTypeId(e.target.value)}
          >
            <MenuItem key={''} value="">
              Todos
            </MenuItem>
            {data.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                {x.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            fullWidth
            label="Espacio reservado"
            value={roomId}
            variant="standard"
            size="small"
            onChange={(e) => setRoomId(e.target.value)}
          >
            <MenuItem key={''} value="">
              Todos
            </MenuItem>
            {roomsData.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                {x.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ flex: 0.1 }}>
          <Tooltip title="Limpiar filtros">
            <Box>
              <IconButton onClick={handleClearFilters} disabled={!roomId && !roomTypeId}>
                <ClearAll color={!roomTypeId && !roomId ? undefined : 'error'} />
              </IconButton>
            </Box>
          </Tooltip>
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
          justInformative
        />
      </Box>
    </Card>
  );
};
