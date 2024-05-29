import { Backdrop, Box, Button, Chip, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { Cancel } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RoomReservationTable } from './RoomReservationTable';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { zodResolver } from '@hookform/resolvers/zod';
import { addRoomReservation, procedureSchema } from '../../../schema/programming/programmingSchemas';
import { useGetAllRooms } from '../../../hooks/programming/useGetAllRooms';
import { IRegisterRoom } from '../../../types/types';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useGetAllSurgeryProcedures } from '../../../hooks/programming/useGetAllSurgeryProcedure';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { checkRoomAvailability, getUnavailableRoomsByIdAndDate } from '../../../services/programming/roomsService';
import { v4 as uuidv4 } from 'uuid';
dayjs.extend(localizedFormat);

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
  maxHeight: { xs: 900 },
};

interface RoomsInput {
  room: string;
  startTime: Dayjs;
  endDate: Dayjs;
}

interface Inputs {
  proceduresId: string[];
}

interface RoomReservationModalProps {
  setOpen: Function;
}

export const RoomReservationModal = (props: RoomReservationModalProps) => {
  const { data: roomsRes, isLoadingRooms } = useGetAllRooms();
  const { data: proceduresRes, isLoadingProcedures } = useGetAllSurgeryProcedures();
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);
  const setRoomValues = useProgrammingRegisterStore((state) => state.setRoomValues);
  const setProcedures = useProgrammingRegisterStore((state) => state.setProcedures);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  const events = useProgrammingRegisterStore((state) => state.events);
  const procedures = useProgrammingRegisterStore((state) => state.procedures);
  const appointmentDate = useProgrammingRegisterStore((state) => state.appointmentDate);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unavailableTimes, setUnavailableTimes] = useState<any[]>([]);

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
      startTime: dayjs(appointmentDate),
      endDate: dayjs(appointmentDate).add(1, 'day'),
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

    const isAvailable = await checkRoomAvailability({
      id: room,
      fechaInicio: dayjs(startTime).format('YYYY/MM/DDTHH:mm:ss'),
      fechaFin: dayjs(endDate).format('YYYY/MM/DDTHH:mm:ss'),
    });
    if (!isAvailable)
      return toast.warning(
        `El cuarto no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`
      );

    const roomFound = roomsRes.find((r) => r.id === room);
    if (roomFound) {
      const roomObj: IRegisterRoom = {
        id: roomFound.id,
        nombre: roomFound.nombre,
        tipoCuarto: roomFound.tipoCuarto,
        horaFin: endDate,
        horaInicio: startTime,
        provisionalId: uuidv4(),
      };
      setRoomValues([...roomValues, roomObj]);
    }
    setValueRooms('endDate', dayjs(appointmentDate).add(1, 'day'));
    setValueRooms('startTime', dayjs(appointmentDate));
    setValueRooms('room', '');
  };

  const {
    register: registerProcedures,
    handleSubmit: handleSubmitProcedures,
    watch: watchProcedures,
    setValue: setValueProcedures,
    formState: { errors: errorsProcedures },
  } = useForm<Inputs>({
    defaultValues: {
      proceduresId: procedures,
    },
    resolver: zodResolver(procedureSchema),
  });
  const watchProceduresId = watchProcedures('proceduresId');

  const onSubmitProcedures: SubmitHandler<Inputs> = async (data) => {
    if (roomValues.length < 1) return toast.warning('Es necesario agregar un cuarto para continuar');
    const procedureNames = data.proceduresId
      .map((id) => {
        const procedure = proceduresRes.find((p) => p.id === id);
        return procedure ? procedure.nombre : '';
      })
      .filter((name) => name);

    const procedureNamesString = procedureNames.join(', ');
    const roomObj = roomValues
      .map((r) => {
        return {
          id: r.provisionalId as string,
          roomId: r.id,
          start: r.horaInicio,
          end: r.horaFin,
          title: r.nombre + ' - ' + procedureNamesString,
          source: 'local',
        };
      })
      .filter((room) => !events.some((event) => event.id === room.id));
    setEvents([...events, ...roomObj]);
    setProcedures(data.proceduresId);
    toast.success('Datos registrados correctamente!');
    props.setOpen(false);
  };

  useEffect(() => {
    if (!watchRoomId) return;
    const fetchUnavailableDays = async () => {
      const res = await getUnavailableRoomsByIdAndDate(watchRoomId, currentDate);
      setUnavailableTimes(res);
    };
    fetchUnavailableDays();
  }, [watchRoomId, currentDate]);

  const verifyTime = (date: Dayjs): boolean => {
    if (!unavailableTimes || unavailableTimes.length < 1) return false;
    const selectedDate = date.toDate();

    for (const time of unavailableTimes) {
      const horaInicio = new Date(time.horaInicio);
      const horaFin = new Date(time.horaFin);
      if (selectedDate >= horaInicio && selectedDate < horaFin) {
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

  if (isLoadingRooms || isLoadingProcedures)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Seleccione un horario" />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          bgcolor: 'background.paper',
          p: 3,
          rowGap: 4,
        }}
      >
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
            Fecha seleccionada: {appointmentDate.toLocaleDateString()}
          </Typography>
        </Box>
        <form onSubmit={handleSubmitProcedures(onSubmitProcedures)} id="form1">
          <Box>
            <Typography>Seleccione los procedimientos:</Typography>
            <TextField
              select
              SelectProps={{
                multiple: true,
                renderValue: (selected: any) => {
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected &&
                        selected.map((value: string) => (
                          <Chip
                            key={value}
                            label={proceduresRes.find((v) => v.id === value)?.nombre}
                            style={{ margin: 2 }}
                            onDelete={() => {
                              const procedureList = watchProceduresId.filter((p) => p !== value);
                              setValueProcedures('proceduresId', procedureList);
                            }}
                            deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()} />}
                          />
                        ))}
                    </div>
                  );
                },
              }}
              label="Procedimientos"
              fullWidth
              error={!!errorsProcedures.proceduresId?.message}
              helperText={errorsProcedures.proceduresId?.message}
              value={watchProceduresId}
              {...registerProcedures('proceduresId')}
            >
              {proceduresRes.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </form>
        <form onSubmit={handleSubmitRooms(onSubmitRooms)}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={4}>
              <Typography>Habitaciones disponibles</Typography>
              <TextField
                select
                label="Habitaciones"
                fullWidth
                {...registerRooms('room')}
                value={watchRoomId}
                error={!!errorsRooms.room?.message}
                helperText={errorsRooms.room?.message}
              >
                {roomsRes
                  .filter((rm) => !roomValues.some((reservedRoom) => reservedRoom.id === rm.id))
                  .map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
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
                          error: !!errorsRooms.startTime?.message,
                          helperText: !!errorsRooms.startTime?.message ? errorsRooms.startTime.message : null,
                        },
                      }}
                      shouldDisableTime={(date) => verifyTime(date)}
                      shouldDisableDate={(date) => verifyDate(date)}
                      onAccept={(e) => {
                        if (verifyTime(e as Dayjs)) {
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
                      shouldDisableTime={(date) => verifyTime(date)}
                      shouldDisableDate={(date) => verifyDate(date)}
                      onAccept={(e) => {
                        if (verifyTime(e as Dayjs)) {
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
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" type="button" onClick={handleSubmitRooms(onSubmitRooms)}>
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <RoomReservationTable />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 1,
        }}
      >
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
        <Button variant="contained" type="submit" form="form1">
          Aceptar
        </Button>
      </Box>
    </Box>
  );
};
