import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetRoomsByRegister } from '../../../../../hooks/admission/useGetRoomsByRegister';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { IRoomEvent } from '../../../../../types/types';
import dayjs from 'dayjs';
import { Add, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getRoomsEventsByDate } from '../../../../../services/programming/roomsService';
import { AddEditCalendar } from './AddEditCalendar';
const TABLE_HEADERS = ['Cuarto', 'Tipo Cuarto', 'Hora Ingreso', 'Hora Salida', 'Acciones'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, md: 800 },
};

const styleCalendar = {
  position: 'absolute',
  top: { xs: '20%', xl: '50%' },
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, md: 500, lg: 800, xl: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  height: { xs: 300, xl: 800 },
};

interface EditCalendarEventModalProps {
  setOpen: Function;
  registerId: string;
}

export const EditCalendarEventModal = (props: EditCalendarEventModalProps) => {
  const { data, isLoading, refetch } = useGetRoomsByRegister(props.registerId);
  const [openCalendar, setOpenCalendar] = useState(false);

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <Box sx={style}>
        <HeaderModal setOpen={props.setOpen} title="Editar Cuartos" />
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button startIcon={<Add />} variant="contained" onClick={() => setOpenCalendar(true)}>
              Agregar
            </Button>
          </Box>
          <EventTable data={data} refetch={refetch} />
        </Box>
        <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <Button>Aceptar</Button>
        </Box>
      </Box>
      <Modal open={openCalendar}>
        <>
          <AddCalendarEvent setOpen={setOpenCalendar} registerId={props.registerId} />
        </>
      </Modal>
    </>
  );
};

const EventTable = (props: { data: IRoomEvent[]; refetch: Function }) => {
  return (
    <Card>
      <Table>
        <TableHeaderComponent headers={TABLE_HEADERS} />
        <TableBody>
          {props.data.map((row, index) => (
            <EventTableRow key={index} data={row} refetch={props.refetch} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const EventTableRow = (props: { data: IRoomEvent; refetch: Function }) => {
  const { data } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{data.nombre}</TableCell>
        <TableCell>{data.tipoCuarto}</TableCell>
        <TableCell>{dayjs(data.fechaInicio).format('DD/MM/YYYY - hh:mm a')}</TableCell>
        <TableCell>{dayjs(data.fechaFin).format('DD/MM/YYYY - hh:mm a')}</TableCell>
        <TableCell>
          <Tooltip title="Editar">
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <EditCalendarEvent
            registerRoomId={data.id}
            setOpen={setOpen}
            eventView={dayjs(data.fechaInicio).toDate()}
            refetch={props.refetch}
          />
        </>
      </Modal>
    </>
  );
};

const useGetEvents = (date: Date, setEvents: Function, events: IRoomEvent[]) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRoomsEventsByDate(date.toISOString());
        if (res.length > 0) {
          const formattedRes = res.map((event) => {
            return {
              id: event.id,
              roomId: event.id_Cuarto,
              title: event.nombre,
              start: new Date(event.fechaInicio),
              end: new Date(event.fechaFin),
            };
          });
          setEvents([...formattedRes]);
        } else {
          setEvents([...events]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [date]);
  return isLoading;
};

const AddCalendarEvent = (props: { setOpen: Function; registerId: string }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const downXl = useMediaQuery(theme.breakpoints.down('xl'));
  const isLoading = useGetEvents(date, setEvents, events);

  if (isLoading && events.length < 1)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={styleCalendar}>
      <HeaderModal setOpen={props.setOpen} title="Selección de horario" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Box>
          <AddEditCalendar
            date={date}
            events={events}
            setEvents={setEvents}
            setDate={setDate}
            calendarHeight={downXl ? 500 : undefined}
            registerId={props.registerId}
          />
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button>Aceptar</Button>
      </Box>
    </Box>
  );
};

const EditCalendarEvent = (props: {
  setOpen: Function;
  registerRoomId: string;
  eventView: Date;
  refetch: Function;
}) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const downXl = useMediaQuery(theme.breakpoints.down('xl'));
  const isLoading = useGetEvents(date, setEvents, events);

  if (isLoading && events.length < 1)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={styleCalendar}>
      <HeaderModal setOpen={props.setOpen} title="Selección de horario" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Box>
          <AddEditCalendar
            date={date}
            events={events}
            setEvents={setEvents}
            setDate={setDate}
            calendarHeight={downXl ? 500 : undefined}
            registerRoomId={props.registerRoomId}
            isEdit
            eventView={props.eventView}
            refetch={props.refetch}
          />
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button>Aceptar</Button>
      </Box>
    </Box>
  );
};
