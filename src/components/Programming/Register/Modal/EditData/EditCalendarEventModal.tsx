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
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { useGetPatientHospitalSpaces } from '../../../../../hooks/admission/useGetPatientHospitalSpaces';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import dayjs from 'dayjs';
import { Add, Close, Edit, Save } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { AddEditCalendar } from './AddEditCalendar';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateDates } from '../../../../../schema/hospitalization/hospitalizationSchema';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useGetAllRooms } from '../../../../../hooks/programming/useGetAllRooms';
import { HospitalSpaceType, IPatientHospitalSpace } from '../../../../../types/admission/admissionTypes';
import { useGetHospitalizationAppointments } from '../../../../../hooks/admission/useGetHospitalizationAppointments';
import { getHospitalRoomReservations } from '../../../../../services/programming/hospitalSpace';
import { modifyRoomsEvents } from '../../../../../services/admission/admisionService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePatientEntryPaginationStore } from '../../../../../store/admission/usePatientEntryPagination';

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
  patientAccountId: string;
  setValue: Function;
}

export const EditCalendarEventModal = (props: EditCalendarEventModalProps) => {
  const { data, isLoading, refetch } = useGetPatientHospitalSpaces(props.patientAccountId);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [rooms, setRooms] = useState<IPatientHospitalSpace[]>([]);
  const refetchTable = usePatientEntryPaginationStore((state) => state.fetchData);

  useEffect(() => {
    if (!data || JSON.stringify(rooms) === JSON.stringify(data)) return;
    setRooms([...data]);
  }, [data]);

  const saveChanges = useCallback(async () => {
    if (JSON.stringify(rooms) === JSON.stringify(data)) return props.setOpen(false);
    try {
      const roomsObj = rooms
        .filter((r) => r.tipoEspacioHospitalario !== HospitalSpaceType.OperatingRoom)
        .map((r) => {
          return {
            id_EspacioHospitalario: r.id_EspacioHospitalario,
            fechaInicio: dayjs(r.horaInicio).toDate(),
            fechaFin: dayjs(r.horaFin).toDate(),
            id_Cuarto: r.id_Cuarto,
          };
        });
      await modifyRoomsEvents({ listaRegistrosCuartos: roomsObj, id_CuentaPaciente: props.patientAccountId });
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
        <HeaderModal setOpen={props.setOpen} title="Editar Espacios Hospitalarios" />
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Los quirófanos no son editables desde esta vista
            </Typography>
            <Button startIcon={<Add />} variant="contained" onClick={() => setOpenCalendar(true)}>
              Agregar Cuarto
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
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={() => props.setValue(0)}>Regresar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Aceptar
          </Button>
        </Box>
      </Box>
      <Modal open={openCalendar}>
        <>
          <AddCalendarEvent setOpen={setOpenCalendar} patientAccountId={props.patientAccountId} />
        </>
      </Modal>
    </>
  );
};

const EventTable = (props: {
  data: IPatientHospitalSpace[];
  refetch: Function;
  setRooms: (rooms: IPatientHospitalSpace[]) => void;
}) => {
  const { data: rooms } = useGetAllRooms('0');
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
              operatingRooms={
                rooms
                  ?.filter((x) => x.id_TipoCuarto === row.id_TipoCuarto)
                  .map((x) => {
                    return { id: x.id_Cuarto, nombre: x.nombre };
                  }) ?? []
              }
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
  data: IPatientHospitalSpace;
  refetch: Function;
  setRooms: (rooms: IPatientHospitalSpace[]) => void;
  rooms: IPatientHospitalSpace[];
  operatingRooms: { id: string; nombre: string }[];
}) => {
  const { data: roomData, operatingRooms } = props;
  const [edit, setEdit] = useState(false);

  const { handleSubmit, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      startDate: dayjs(roomData.horaInicio).toDate(),
      endDate: dayjs(roomData.horaFin).toDate(),
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
          const isAvailable = await getHospitalRoomReservations({
            initialDate: dayjs(data.startDate).format('YYYY/MM/DDTHH:mm:ss'),
            endDate: dayjs(data.endDate).format('YYYY/MM/DDTHH:mm:ss'),
            roomId: data.roomId,
            hospitalizationSpaceId: roomData.id_EspacioHospitalario,
          });
          if (isAvailable.length > 0) {
            const startTimeDayjs = dayjs(data.startDate).format('DD/MM/YYYY - HH:mm');
            const endTimeDayjs = dayjs(data.endDate).format('DD/MM/YYYY - HH:mm');
            return Swal.fire({
              title: 'Error',
              text: `El espacio reservado no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`,
              icon: 'error',
            });
          }
          await FindAndUpdateRoom(roomData.id_EspacioHospitalario, props.rooms, props.setRooms, data, operatingRooms);
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

  const isSurgeryRoom = roomData.tipoEspacioHospitalario === HospitalSpaceType.OperatingRoom;

  return (
    <TableRow>
      <TableCell sx={{ width: '25%' }}>
        {!edit ? (
          <>
            {roomData.nombre}
            {isSurgeryRoom && (
              <Typography variant="caption" color="text.secondary" display="block">
                (Quirófano - No editable)
              </Typography>
            )}
          </>
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
          dayjs(roomData.horaInicio).format('DD/MM/YYYY - hh:mm a')
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Hora inicio"
              value={dayjs(watch('startDate'))}
              onChange={(newValue) => setValue('startDate', newValue?.toDate() || new Date())}
              format="DD/MM/YYYY HH:mm"
              ampm={false}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        )}
      </TableCell>
      <TableCell>
        {!edit ? (
          dayjs(roomData.horaFin).format('DD/MM/YYYY - hh:mm a')
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Hora fin"
              value={dayjs(watch('endDate'))}
              onChange={(newValue) => setValue('endDate', newValue?.toDate() || new Date())}
              format="DD/MM/YYYY HH:mm"
              ampm={false}
              sx={{ width: '100%' }}
              minDateTime={dayjs(watch('startDate'))}
            />
          </LocalizationProvider>
        )}
      </TableCell>
      <TableCell>
        {!isSurgeryRoom &&
          (!edit ? (
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
          ))}
      </TableCell>
    </TableRow>
  );
};

const AddCalendarEvent = (props: { setOpen: Function; patientAccountId: string }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const downXl = useMediaQuery(theme.breakpoints.down('xl'));
  const { isLoading } = useGetHospitalizationAppointments(date, setEvents, events, 0, [], () => {});

  if (isLoading)
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
            patientAccountId={props.patientAccountId}
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
  rooms: IPatientHospitalSpace[],
  setRooms: (rooms: IPatientHospitalSpace[]) => void,
  dates: { startDate: Date; endDate: Date; roomId: string },
  operatingRooms: { id: string; nombre: string }[]
) {
  const newRooms = [...rooms];
  const roomIndex = newRooms.findIndex((room) => room.id_EspacioHospitalario === registerRoomId);

  if (roomIndex !== -1) {
    const room = operatingRooms.find((or) => or.id === dates.roomId);
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      id_Cuarto: room?.id ?? '',
      nombre: room?.nombre ?? '',
      horaInicio: dayjs(dates.startDate).format('YYYY/MM/DDTHH:mm'),
      horaFin: dayjs(dates.endDate).format('YYYY/MM/DDTHH:mm'),
    };
    setRooms(newRooms);
  }
}
