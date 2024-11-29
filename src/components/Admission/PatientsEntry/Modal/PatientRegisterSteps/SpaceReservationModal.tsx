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
import {
  getHospitalRoomReservations,
  getSurgeryRoomsReservations,
} from '../../../../../services/programming/hospitalSpace';
import { IHospitalRoom } from '../../../../../types/programming/hospitalRoomTypes';
import { ISurgeryRoom } from '../../../../../types/programming/surgeryRoomTypes';
import { convertDate } from '@/utils/convertDate';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';
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
  roomType: HospitalSpaceType;
}

interface RoomsInput {
  room: string;
  startTime: Dayjs;
  stayDays?: number;
  endDate?: Dayjs;
}

const HEADERS = ['Cuarto', 'Hora Inicio', 'Hora Fin', 'Acciones'];

const isSurgeryRoom = (room: IHospitalRoom | ISurgeryRoom): room is ISurgeryRoom => {
  return 'id_Quirofano' in room;
};

const isHospitalRoom = (room: IHospitalRoom | ISurgeryRoom): room is IHospitalRoom => {
  return 'id_Cuarto' in room;
};

export const SpaceReservationModal = ({ setOpen, roomType }: HospitalizationSpaceReservationModalProps) => {
  const { data: roomsRes, isLoading } = useGetAllRooms<HospitalSpaceType>(roomType);
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
      room: '',
      ...(roomType === HospitalSpaceType.Room
        ? {
            stayDays: 1,
            endDate: dayjs(appointmentStartDate).add(1, 'day'),
          }
        : {
            endDate: dayjs(appointmentEndDate),
          }),
    },
  });
  const watchRoomId = watchRooms('room');
  const watchStartTime = watchRooms('startTime');
  const watchStayDays = watchRooms('stayDays');
  const watchEndTime = watchRooms('endDate');

  const onSubmitRooms: SubmitHandler<RoomsInput> = async (data) => {
    const startTimeDayjs = dayjs(data.startTime).format('DD/MM/YYYY - HH:mm');
    const endTimeDayjs = dayjs(data.endDate).format('DD/MM/YYYY - HH:mm');
    const startTime = data.startTime as any as Date;
    const endDate = data.endDate as any as Date;
    const room = data.room;

    const isAvailable =
      roomType === HospitalSpaceType.Room
        ? await getHospitalRoomReservations({
            roomId: room,
            initialDate: convertDate(startTime),
            endDate: convertDate(endDate),
          })
        : await getSurgeryRoomsReservations({
            surgeryRoomId: room,
            initialDate: convertDate(startTime),
            endDate: convertDate(endDate),
          });
    if (isAvailable.length > 0)
      return toast.warning(
        `El ${roomType === HospitalSpaceType.Room ? 'cuarto' : 'quirófano'} no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`
      );

    const roomFound = roomsRes?.find((r) => {
      if (roomType === HospitalSpaceType.Room && isHospitalRoom(r)) {
        return r.id_Cuarto === room;
      } else if (roomType === HospitalSpaceType.OperatingRoom && isSurgeryRoom(r)) {
        return r.id_Quirofano === room;
      }
      return false;
    });

    if (roomFound) {
      const roomObj: IRegisterRoom = {
        id: isHospitalRoom(roomFound) ? roomFound.id_Cuarto : roomFound.id_Quirofano,
        nombre: roomFound.nombre,
        id_TipoCuarto: isHospitalRoom(roomFound) ? roomFound.id_TipoCuarto : roomFound.id_TipoQuirofano,
        precio: 0,
        horaFin: endDate,
        horaInicio: startTime,
        provisionalId: uuidv4(),
        tipoCuarto: roomType === HospitalSpaceType.Room ? 0 : 1,
      };
      setRoomsRegistered([...roomsRegistered, roomObj]);
    }
    setValueRooms('endDate', dayjs(appointmentEndDate));
    setValueRooms('startTime', dayjs(appointmentStartDate));
    setValueRooms('room', '');
  };

  const getRoomTypeLabel = (type: HospitalSpaceType) => (type === HospitalSpaceType.Room ? 'cuarto' : 'quirófano');

  const onSubmit = async () => {
    if (
      (roomType !== HospitalSpaceType.Room && roomsRegistered.length < 1) ||
      (!roomsRegistered.some((r) => r.tipoCuarto === (roomType === HospitalSpaceType.Room ? 0 : 1)) &&
        roomType !== HospitalSpaceType.Room)
    ) {
      return toast.warning(`Es necesario agregar un ${getRoomTypeLabel(roomType)} para continuar`);
    }
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

  useEffect(() => {
    if (watchStartTime && watchStayDays && roomType === HospitalSpaceType.Room) {
      console.log('AAAA');
      const newEndDate = dayjs(watchStartTime).add(watchStayDays, 'day');
      setValueRooms('endDate', newEndDate);
    }
  }, [watchStartTime, watchStayDays]);

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
    return roomsRegistered.some((r) => r.tipoCuarto === (roomType === HospitalSpaceType.Room ? 0 : 1));
  };

  if (isLoading)
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
              <Typography>{roomType === HospitalSpaceType.Room ? 'Habitaciones' : 'Quirófanos'} disponibles</Typography>
              <TextField
                select
                label={`${roomType === HospitalSpaceType.Room ? 'Habitaciones' : 'Quirófanos'}`}
                fullWidth
                {...registerRooms('room')}
                value={watchRoomId}
                disabled={handleValidateRooms()}
                error={!!errorsRooms.room?.message}
                helperText={errorsRooms.room?.message}
              >
                {roomsRes
                  ?.filter((rm) => {
                    const currentId = isHospitalRoom(rm) ? rm.id_Cuarto : rm.id_Quirofano;
                    return !roomsRegistered.some((reservedRoom) => reservedRoom.id === currentId);
                  })
                  .map((rm) => {
                    const id = isHospitalRoom(rm) ? rm.id_Cuarto : rm.id_Quirofano;
                    return (
                      <MenuItem key={id} value={id}>
                        {rm.nombre}
                      </MenuItem>
                    );
                  })}
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
              <Typography>
                {roomType === HospitalSpaceType.Room ? 'Días de estancia estimados' : 'Hora de salida'}
              </Typography>
              <Controller
                control={controlRooms}
                name={roomType === HospitalSpaceType.Room ? 'stayDays' : 'endDate'}
                render={({ field: { onChange, value } }) =>
                  roomType === HospitalSpaceType.Room ? (
                    <TextField
                      type="number"
                      label="Días de estancia"
                      fullWidth
                      InputProps={{
                        inputProps: {
                          min: 1,
                          max: 365,
                        },
                        onKeyDown: (e) => {
                          if (e.key === '-' || e.key === '+' || e.key === 'e') {
                            e.preventDefault();
                          }
                        },
                      }}
                      disabled={watchRoomId.trim() === ''}
                      value={value || ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        if (inputValue === '') {
                          onChange('');
                          return;
                        }

                        const days = parseInt(inputValue);

                        if (!isNaN(days) && days >= 1 && days <= 365 && Number.isInteger(days)) {
                          onChange(days);
                          setCurrentDate(
                            new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + days)
                          );
                        }
                      }}
                      error={!!errorsRooms.stayDays?.message}
                      helperText={
                        errorsRooms.stayDays?.message ||
                        `Fecha de salida estimada: ${watchEndTime?.format('DD/MM/YYYY - HH:mm')}`
                      }
                    />
                  ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Hora salida"
                        ampm={false}
                        value={value as Dayjs}
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
                            helperText: !!errorsRooms.endDate?.message
                              ? errorsRooms.endDate.message === 'Invalid date'
                                ? 'Fecha invalida'
                                : errorsRooms.endDate.message
                              : null,
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
                  )
                }
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
