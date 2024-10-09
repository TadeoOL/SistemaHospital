import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetRoomsByRegister } from '../../../../../hooks/admission/useGetRoomsByRegister';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { IRoomEvent } from '../../../../../types/types';
import dayjs from 'dayjs';
import { Add, Close, Delete, Edit, Save } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { checkRoomAvailabilityToEdit, getRoomsEventsByDate } from '../../../../../services/programming/roomsService';
import { AddEditCalendar } from './AddEditCalendar';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateDates } from '../../../../../schema/hospitalization/hospitalizationSchema';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { deleteRegisterRoom, modifyRoomsEvents } from '../../../../../services/programming/admissionRegisterService';
import { usePatientRegisterPaginationStore } from '../../../../../store/programming/patientRegisterPagination';
import { useGetAllRooms } from '../../../../../hooks/programming/useGetAllRooms';

const TABLE_HEADERS = ['Cuarto', 'Hora Ingreso', 'Hora Salida', 'Acciones'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 750 },
  borderRadius: 2,
  boxShadow: 24,
  maxHeight: { xs: 650, md: 800 },
};

const styleCalendar = {
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

const style2 = {
  bgcolor: 'background.paper',
  overflowY: 'auto',
  p: 2,
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

interface EditCalendarEventModalProps {
  setOpen: Function;
  registerId: string;
}

export const EditCalendarEventModal = (props: EditCalendarEventModalProps) => {
  const { data, isLoading, refetch } = useGetRoomsByRegister(props.registerId);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [rooms, setRooms] = useState<IRoomEvent[]>([]);
  const refetchTable = usePatientRegisterPaginationStore((state) => state.fetchData);

  useEffect(() => {
    if (!data || JSON.stringify(rooms) === JSON.stringify(data)) return;
    setRooms([...data]);
  }, [data]);

  const saveChanges = useCallback(async () => {
    if (JSON.stringify(rooms) === JSON.stringify(data)) return props.setOpen(false);
    try {
      const roomsObj = rooms.map((r) => {
        return {
          id_RegistroCuarto: r.id,
          fechaInicio: dayjs(r.fechaInicio).toDate(),
          fechaFin: dayjs(r.fechaFin).toDate(),
          id_Cuarto: r.id_Cuarto,
        };
      });
      await modifyRoomsEvents({ listaRegistrosCuartos: roomsObj, id_Registro: props.registerId });
      refetchTable();
      Swal.fire('Guardado!', 'Los cambios se han guardado correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      Swal.fire('Error', 'Hubo un error al guardar los cambios', 'error');
    }
  }, [rooms, data]);

  const handleSubmit = () => {
    Swal.fire({
      title: '¿Está seguro de guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        saveChanges();
      }
    });
  };

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
          <Box sx={{ overflow: 'auto' }}>
            <Box sx={{ minWidth: '600px', maxHeight: '600px' }}>
              <EventTable data={rooms} refetch={refetch} setRooms={setRooms} />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained" onClick={handleSubmit}>
            Aceptar
          </Button>
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

const EventTable = (props: { data: IRoomEvent[]; refetch: Function; setRooms: (rooms: IRoomEvent[]) => void }) => {
  const { data: rooms } = useGetAllRooms();
  return (
    <Card>
      <Table>
        <TableHeaderComponent headers={TABLE_HEADERS} />
        <TableBody>
          {props.data.map((row, index) => (
            <EventTableRow
              key={index}
              data={row}
              refetch={props.refetch}
              rooms={props.data}
              setRooms={props.setRooms}
              operatingRooms={rooms
                .filter((x) => x.tipo === row.tipo)
                .map((x) => {
                  return { id: x.id, nombre: x.nombre };
                })}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

interface Inputs {
  startDate: Date;
  endDate: Date;
  roomId: string;
}
const EventTableRow = (props: {
  data: IRoomEvent;
  refetch: Function;
  setRooms: (rooms: IRoomEvent[]) => void;
  rooms: IRoomEvent[];
  operatingRooms: { id: string; nombre: string }[];
}) => {
  const { data: roomData, operatingRooms } = props;
  const [edit, setEdit] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      startDate: dayjs(roomData.fechaInicio).toDate(),
      endDate: dayjs(roomData.fechaFin).toDate(),
      roomId: roomData.id_Cuarto,
    },
    resolver: zodResolver(validateDates),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    withReactContent(Swal)
      .fire({
        title: '¿Estás seguro de editar el espacio?',
        html: `La fecha de inicio sera <b>${dayjs(data.startDate).format('DD/MM/YYYY - HH:mm')}</b> y la fecha de finalización sera <b>${dayjs(data.endDate).format('DD/MM/YYYY - HH:mm')}</b>,<br/> y el espacio reservado sera el <b>${props.operatingRooms.find((x) => x.id === data.roomId)?.nombre}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cambiar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          const isAvailable = await checkRoomAvailabilityToEdit({
            id_RegistroCuarto: roomData.id,
            id_Cuarto: data.roomId,
            fechaInicio: dayjs(data.startDate).format('YYYY/MM/DDTHH:mm:ss'),
            fechaFin: dayjs(data.endDate).format('YYYY/MM/DDTHH:mm:ss'),
          });
          if (!isAvailable) {
            const startTimeDayjs = dayjs(data.startDate).format('DD/MM/YYYY - HH:mm');
            const endTimeDayjs = dayjs(data.endDate).format('DD/MM/YYYY - HH:mm');
            return Swal.fire({
              title: 'Error',
              text: `El espacio reservado no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`,
              icon: 'error',
            });
          }
          await FindAndUpdateRoom(props.data.id, props.rooms, props.setRooms, data, operatingRooms);
          Swal.fire({
            title: 'Cambiado!',
            text: 'La fecha de reserva se ha modificado con éxito.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          setEdit(false);
        }
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el espacio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRegisterRoom({
            id_RegistroCuarto: roomData.id,
          });
          props.setRooms(props.rooms.filter((x) => x.id !== roomData.id));
          Swal.fire({
            title: '¡Espacio eliminado!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al eliminar el espacio:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el espacio, intenta de nuevo.',
            icon: 'error',
          });
        }
      }
    });
  };

  return (
    <TableRow>
      <TableCell sx={{ width: '25%' }}>
        {!edit ? (
          roomData.nombre
        ) : (
          <TextField
            select
            label="Espacios reservados"
            fullWidth
            value={watch('roomId')}
            onChange={(e) => setValue('roomId', e.target.value)}
          >
            {props.operatingRooms.map((or) => (
              <MenuItem key={or.id} value={or.id}>
                {or.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
      </TableCell>
      <TableCell>
        {!edit ? (
          dayjs(roomData.fechaInicio).format('DD/MM/YYYY - hh:mm a')
        ) : (
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  ampm={false}
                  label="Fecha inicio"
                  format="DD/MM/YYYY - HH:mm"
                  minDate={dayjs().subtract(3, 'day')}
                  value={dayjs(value)}
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      error: !!errors.startDate?.message,
                      helperText: errors.startDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        )}
      </TableCell>
      <TableCell>
        {!edit ? (
          dayjs(roomData.fechaFin).format('DD/MM/YYYY - hh:mm a')
        ) : (
          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  ampm={false}
                  label="Fecha salida"
                  format="DD/MM/YYYY - HH:mm"
                  value={dayjs(value)}
                  minDate={dayjs().subtract(3, 'day')}
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      error: !!errors.endDate?.message,
                      helperText: errors.endDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        )}
      </TableCell>
      <TableCell>
        {!edit ? (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setEdit(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete();
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Guardar">
              <IconButton onClick={handleSubmit(onSubmit)}>
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar">
              <IconButton onClick={() => setEdit(false)}>
                <Close color="error" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </TableCell>
    </TableRow>
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
      <Box sx={style2}>
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
    </Box>
  );
};

// const EditCalendarEvent = (props: {
//   setOpen: Function;
//   registerRoomId: string;
//   eventView: Date;
//   refetch: Function;
// }) => {
//   const [date, setDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const theme = useTheme();
//   const downXl = useMediaQuery(theme.breakpoints.down('xl'));
//   const isLoading = useGetEvents(date, setEvents, events);

//   if (isLoading && events.length < 1)
//     return (
//       <Backdrop open>
//         <CircularProgress />
//       </Backdrop>
//     );
//   return (
//     <Box sx={styleCalendar}>
//       <HeaderModal setOpen={props.setOpen} title="Selección de horario" />
//       <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
//         <Box>
//           <AddEditCalendar
//             date={date}
//             events={events}
//             setEvents={setEvents}
//             setDate={setDate}
//             calendarHeight={downXl ? 500 : undefined}
//             registerRoomId={props.registerRoomId}
//             isEdit
//             eventView={props.eventView}
//             refetch={props.refetch}
//           />
//         </Box>
//       </Box>
//       <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
//         <Button>Aceptar</Button>
//       </Box>
//     </Box>
//   );
// };

async function FindAndUpdateRoom(
  registerRoomId: string,
  rooms: IRoomEvent[],
  setRooms: (rooms: IRoomEvent[]) => void,
  dates: { startDate: Date; endDate: Date; roomId: string },
  operatingRooms: { id: string; nombre: string }[]
) {
  const newRooms = [...rooms];
  const roomIndex = newRooms.findIndex((room) => room.id === registerRoomId);

  if (roomIndex !== -1) {
    const room = operatingRooms.find((or) => or.id === dates.roomId);
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      id_Cuarto: room?.id ?? '',
      nombre: room?.nombre ?? '',
      fechaInicio: dayjs(dates.startDate).format('YYYY/MM/DDTHH:mm'),
      fechaFin: dayjs(dates.endDate).format('YYYY/MM/DDTHH:mm'),
    };
    setRooms(newRooms);
  }
}
