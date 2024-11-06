import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { addRoomReservation } from '../../../../../schema/programming/programmingSchemas';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { useGetAllRooms } from '../../../../../hooks/programming/useGetAllRooms';
import { toast } from 'react-toastify';
import { IRegisterRoom } from '../../../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import { TableHeaderComponent } from '../../../../Commons/TableHeaderComponent';
import { NoDataInTableInfo } from '../../../../Commons/NoDataInTableInfo';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es-mx';
import { getSurgeryRoomsReservations } from '../../../../../services/programming/hospitalSpace';
dayjs.extend(localizedFormat);
dayjs.locale('es-MX');

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

interface HospitalizationSpaceReservationModalProps {
  setOpen: Function;
  roomType: string;
}

interface RoomsInput {
  room: string;
  startTime: Dayjs;
  endDate: Dayjs;
}

const HEADERS = ['Cuarto', 'Hora Inicio', 'Hora Fin', 'Acciones'];

export const SpaceReservationModal = ({ setOpen, roomType }: HospitalizationSpaceReservationModalProps) => {
  const { data: roomsRes, isLoadingRooms } = useGetAllRooms(roomType);
  const appointmentStartDate = usePatientEntryRegisterStepsStore((state) => state.appointmentStartDate);
  const appointmentEndDate = usePatientEntryRegisterStepsStore((state) => state.appointmentEndDate);
  const [unavailableTimes, setUnavailableTimes] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const setRoomsRegistered = usePatientEntryRegisterStepsStore((state) => state.setRoomsRegistered);
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const setStartDateSurgery = usePatientEntryRegisterStepsStore((state) => state.setStartDateSurgery);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const events = usePatientEntryRegisterStepsStore((state) => state.hospitalizationEvents);
  const setEvents = usePatientEntryRegisterStepsStore((state) => state.setHospitalizationEvents);

  const {
    control: controlRooms,
    register: registerRooms,
    handleSubmit: handleSubmitRooms,
    watch: watchRooms,
    setValue: setValueRooms,
    formState: { errors: errorsRooms },
  } = useForm<RoomsInput>({
    resolver: zodResolver(addRoomReservation),
    defaultValues: {
      startTime: dayjs(appointmentStartDate),
      endDate: dayjs(appointmentEndDate),
      room: '',
    },
  });
  const watchRoomId = watchRooms('room');

  const onSubmitRooms: SubmitHandler<RoomsInput> = async (data) => {
    const startTimeDayjs = dayjs(data.startTime).format('DD/MM/YYYY - HH:mm');
    const endTimeDayjs = dayjs(data.endDate).format('DD/MM/YYYY - HH:mm');
    const startTime = data.startTime as any as Date;
    const endDate = data.endDate as any as Date;
    const room = data.room;

    const isAvailable = await getSurgeryRoomsReservations({
      surgeryRoomId: room,
      initialDate: dayjs(startTime).format('YYYY/MM/DDTHH:mm:ss'),
      endDate: dayjs(endDate).format('YYYY/MM/DDTHH:mm:ss'),
    });
    if (isAvailable.length > 0)
      return toast.warning(
        `El ${roomType == '0' ? 'cuarto' : 'quirófano'} no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`
      );

    const roomFound = roomsRes.find((r: any) => r.id_Cuarto === room || r.id_Quirofano === room);
    if (roomFound) {
      const roomObj: IRegisterRoom = {
        id: roomFound.id_Cuarto || roomFound.id_Quirofano,
        nombre: roomFound.nombre,
        id_TipoCuarto: roomFound.id_TipoCuarto || roomFound.id_TipoQuirofano,
        precio: roomFound.precio,
        horaFin: endDate,
        horaInicio: startTime,
        provisionalId: uuidv4(),
        tipoCuarto: roomType == '0' ? 0 : 1,
      };
      setRoomsRegistered([...roomsRegistered, roomObj]);
    }
    setValueRooms('endDate', dayjs(appointmentEndDate));
    setValueRooms('startTime', dayjs(appointmentStartDate));
    setValueRooms('room', '');
  };

  const onSubmit = async () => {
    if (
      (roomType != '0' && roomsRegistered.length < 1) ||
      (!roomsRegistered.some((r) => r.tipoCuarto == 1) && roomType != '0')
    )
      return toast.warning(`Es necesario agregar un ${roomType == '0' ? 'cuarto' : 'quirófano'} para continuar`);

    let startDate = roomsRegistered[0].horaInicio;
    for (let i = 1; i < roomsRegistered.length; i++) {
      if (roomsRegistered[i].horaInicio < startDate) {
        startDate = roomsRegistered[i].horaInicio;
      }
    }
    setStartDateSurgery(startDate);
    const roomObj = roomsRegistered
      .map((r) => {
        return {
          id: r.provisionalId as string,
          roomId: r.id,
          start: r.horaInicio,
          end: r.horaFin,
          title: r.nombre,
          source: 'local',
        };
      })
      .filter((room) => !events.some((event) => event.id === room.id));
    setEvents([...events, ...roomObj]);

    toast.success('Datos registrados correctamente!');
    setStep(step + 1);
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!watchRoomId) return;
    const fetchUnavailableDays = async () => {
      try {
        const res = await getSurgeryRoomsReservations({
          endDate: currentDate.toISOString(),
          surgeryRoomId: watchRoomId,
        });
        setUnavailableTimes(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnavailableDays();
  }, [watchRoomId, currentDate]);

  const shouldDisableMinute = (time: Dayjs): boolean => {
    if (!unavailableTimes || unavailableTimes.length < 1) return false;

    const selectedDate = time.toDate();

    for (const event of unavailableTimes) {
      const horaInicio = new Date(event.horaInicio);
      const horaFin = new Date(event.horaFin);

      if (selectedDate >= horaInicio && selectedDate < horaFin) {
        return true;
      }
    }

    return false;
  };

  const shouldDisableHour = (time: Dayjs): boolean => {
    if (!unavailableTimes || unavailableTimes.length < 1) return false;

    const selectedHourStart = time.startOf('hour').toDate();
    const selectedHourEnd = time.endOf('hour').toDate();

    for (const event of unavailableTimes) {
      const horaInicio = new Date(event.horaInicio);
      const horaFin = new Date(event.horaFin);

      if (selectedHourStart >= horaInicio && selectedHourEnd <= horaFin) {
        return true;
      }
    }

    return false;
  };

  const verifyDate = (date: Dayjs): boolean => {
    const dayStart = date.startOf('day').toDate();
    const dayEnd = date.endOf('day').toDate();

    let isDayFullyOccupied = false;

    for (const time of unavailableTimes) {
      const horaInicio = new Date(time.horaInicio);
      const horaFin = new Date(time.horaFin);

      if (horaInicio <= dayStart && horaFin >= dayEnd) {
        isDayFullyOccupied = true;
        break;
      }
    }

    if (isDayFullyOccupied) {
      return true;
    }

    let startCovered = false;
    let endCovered = false;

    for (const time of unavailableTimes) {
      const horaInicio = new Date(time.horaInicio);
      const horaFin = new Date(time.horaFin);

      if (horaInicio <= dayStart && horaFin > dayStart) {
        startCovered = true;
      }

      if (horaInicio < dayEnd && horaFin >= dayEnd) {
        endCovered = true;
      }

      if (startCovered && endCovered) {
        return true;
      }
    }

    return false;
  };

  const handleValidateRooms = () => {
    return roomsRegistered.some((r) => r.tipoCuarto == parseFloat(roomType));
  };

  if (isLoadingRooms)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Reservación de Espacio" />
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
            Fecha seleccionada: {appointmentStartDate.toLocaleDateString()} - {appointmentEndDate.toLocaleDateString()}
          </Typography>
        </Box>
        <form onSubmit={handleSubmitRooms(onSubmitRooms)}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={4}>
              <Typography>{roomType == '0' ? 'Habitaciones' : 'Quirófanos'} disponibles</Typography>
              <TextField
                select
                label={`${roomType == '0' ? 'Habitaciones' : 'Quirófanos'}`}
                fullWidth
                {...registerRooms('room')}
                value={watchRoomId}
                disabled={handleValidateRooms()}
                error={!!errorsRooms.room?.message}
                helperText={errorsRooms.room?.message}
              >
                {roomsRes
                  .filter(
                    (rm: any) =>
                      !roomsRegistered.some(
                        (reservedRoom) => reservedRoom.id === rm.id_Cuarto || reservedRoom.id === rm.id_Quirofano
                      )
                  )
                  .map((rm: any) => (
                    <MenuItem key={rm.id_Cuarto || rm.id_Quirofano} value={rm.id_Cuarto || rm.id_Quirofano}>
                      {rm.nombre}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item sm={12} md={4}>
              <Typography>Hora de admisión</Typography>
              <Controller
                control={controlRooms}
                name="startTime"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Hora admisión"
                      ampm={false}
                      sx={{
                        width: '100%',
                      }}
                      value={value}
                      onMonthChange={(e) => {
                        const date = e.toDate();
                        setCurrentDate(date);
                      }}
                      onYearChange={(e) => {
                        const date = e.toDate();
                        setCurrentDate(date);
                      }}
                      onChange={(date) => {
                        const dayjsToDate = date?.toDate();
                        setCurrentDate(dayjsToDate as Date);
                        onChange(date);
                      }}
                      minDateTime={dayjs(new Date())}
                      format="DD/MM/YYYY HH:mm"
                      disabled={watchRoomId.trim() === ''}
                      slotProps={{
                        textField: {
                          error: !!errorsRooms.startTime?.message,
                          helperText: !!errorsRooms.startTime?.message ? errorsRooms.startTime.message : null,
                        },
                      }}
                      shouldDisableTime={(time, view) => {
                        if (view === 'minutes') {
                          return shouldDisableMinute(dayjs(time));
                        }
                        if (view === 'hours') {
                          return shouldDisableHour(dayjs(time));
                        }
                        return false;
                      }}
                      shouldDisableDate={(date) => verifyDate(date)}
                      onAccept={(e) => {
                        if (shouldDisableMinute(e as Dayjs)) {
                          toast.error('La fecha no es valida!');
                          onChange(dayjs());
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <Typography>Hora de salida estimada</Typography>
              <Controller
                control={controlRooms}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Hora salida"
                      ampm={false}
                      value={value}
                      onChange={(date) => {
                        const dayjsToDate = date?.toDate();
                        setCurrentDate(dayjsToDate as Date);
                        onChange(date);
                      }}
                      minDateTime={dayjs(new Date())}
                      format="DD/MM/YYYY HH:mm"
                      disabled={watchRoomId.trim() === ''}
                      slotProps={{
                        textField: {
                          error: !!errorsRooms.endDate?.message,
                          helperText: !!errorsRooms.endDate?.message ? errorsRooms.endDate.message : null,
                        },
                      }}
                      shouldDisableTime={(time, view) => {
                        if (view === 'minutes') {
                          return shouldDisableMinute(dayjs(time));
                        }
                        if (view === 'hours') {
                          return shouldDisableHour(dayjs(time));
                        }
                        return false;
                      }}
                      shouldDisableDate={(date) => verifyDate(date)}
                      onAccept={(e) => {
                        if (shouldDisableMinute(e as Dayjs)) {
                          toast.error('La fecha no es valida!');
                          onChange(dayjs().add(1, 'hour'));
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={handleSubmitRooms(onSubmitRooms)}
                  disabled={handleValidateRooms()}
                >
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        <HospitalizationSpaceReservedTable />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

const HospitalizationSpaceReservedTable = () => {
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHeaderComponent headers={HEADERS} />
          <HospitalizationSpaceReservedTableBody />
        </Table>
      </TableContainer>
      {roomsRegistered.length < 1 && (
        <NoDataInTableInfo infoTitle="No hay cuartos registrados" sizeIcon={30} variantText="h4" />
      )}
    </Card>
  );
};

const HospitalizationSpaceReservedTableBody = () => {
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);

  return (
    <TableBody>
      {roomsRegistered.map((room) => (
        <HospitalizationSpaceReservedTableRow key={room.id} data={room} />
      ))}
    </TableBody>
  );
};
interface HospitalizationSpaceReservedTableRowProps {
  data: IRegisterRoom;
}
const HospitalizationSpaceReservedTableRow = ({ data }: HospitalizationSpaceReservedTableRowProps) => {
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const setRoomsRegistered = usePatientEntryRegisterStepsStore((state) => state.setRoomsRegistered);
  const setEvents = usePatientEntryRegisterStepsStore((state) => state.setHospitalizationEvents);
  const events = usePatientEntryRegisterStepsStore((state) => state.hospitalizationEvents);

  const handleRemove = () => {
    setRoomsRegistered(roomsRegistered.filter((room) => room.id !== data.id));
    setEvents(events.filter((e) => e.roomId !== data.id));
  };

  return (
    <TableRow>
      <TableCell>{data.nombre}</TableCell>
      <TableCell>{dayjs(data.horaInicio).format('DD/MM/YYYY - HH:mm')}</TableCell>
      <TableCell>{dayjs(data.horaFin).format('DD/MM/YYYY - HH:mm')}</TableCell>
      <TableCell>
        <Box>
          <Tooltip title="Eliminar">
            <IconButton onClick={handleRemove}>
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
