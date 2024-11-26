import { Backdrop, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RoomReservationTable } from './RoomReservationTable';
import dayjs, { Dayjs } from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { addRoomReservation } from '../../../schema/programming/programmingSchemas';
import { useGetAllRooms } from '../../../hooks/programming/useGetAllRooms';
import { IEventsCalendar, IRegisterRoom } from '../../../types/types';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { getUnavailableRoomsByIdAndDate } from '../../../services/programming/roomsService';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es-mx';
import { ISurgeryRoom } from '../../../types/programming/surgeryRoomTypes';
import { IHospitalRoom } from '../../../types/programming/hospitalRoomTypes';
import { getHospitalRoomReservations, getSurgeryRoomsReservations } from '../../../services/programming/hospitalSpace';
import { addHospitalizationSpace } from '../../../services/admission/admisionService';
dayjs.extend(localizedFormat);
dayjs.locale('es-MX');

interface RoomsInput {
  room: string;
  startTime: Dayjs;
  endDate: Dayjs;
}

interface RoomReservationModalProps {
  setOpen: Function;
  isEdit?: boolean;
  patientAccountId: string;
  setEvents?: (eventsCalendar: IEventsCalendar[]) => void;
  isOperatingRoomReservation?: boolean;
}

export const RoomReservationModal = (props: RoomReservationModalProps) => {
  const { data: roomsRes, isLoading } = useGetAllRooms<'0' | '1'>(props.isOperatingRoomReservation ? '1' : '0');
  const roomValues = useProgrammingRegisterStore((state) => state.roomValues);
  const setRoomValues = useProgrammingRegisterStore((state) => state.setRoomValues);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  const clearAllData = useProgrammingRegisterStore((state) => state.clearAllData);
  const events = useProgrammingRegisterStore((state) => state.events);
  const appointmentStartDate = useProgrammingRegisterStore((state) => state.appointmentStartDate);
  const appointmentEndDate = useProgrammingRegisterStore((state) => state.appointmentEndDate);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unavailableTimes, setUnavailableTimes] = useState<any[]>([]);
  const setStep = useProgrammingRegisterStore((state) => state.setStep);
  const setStartDateSurgery = useProgrammingRegisterStore((state) => state.setStartDateSurgery);
  const step = useProgrammingRegisterStore((state) => state.step);
  const refetch = usePatientRegisterPaginationStore((state) => state.fetchData);

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

    const isAvailable = props.isOperatingRoomReservation
      ? await getSurgeryRoomsReservations({
          surgeryRoomId: room,
          initialDate: dayjs(startTime).format('YYYY/MM/DDTHH:mm:ss'),
          endDate: dayjs(endDate).format('YYYY/MM/DDTHH:mm:ss'),
        })
      : await getHospitalRoomReservations({
          endDate: dayjs(endDate).format('YYYY/MM/DDTHH:mm:ss'),
          initialDate: dayjs(startTime).format('YYYY/MM/DDTHH:mm:ss'),
          roomId: room,
        });
    if (isAvailable.length > 0)
      return toast.warning(
        `El cuarto no esta disponible de ${startTimeDayjs} a ${endTimeDayjs}, te sugerimos verificar las fechas correctamente.`
      );

    const roomFound = roomsRes?.find((r) => {
      if (props.isOperatingRoomReservation) {
        return (r as ISurgeryRoom).id_Quirofano === room;
      } else {
        return (r as IHospitalRoom).id_Cuarto === room;
      }
    });

    if (roomFound) {
      const roomObj: IRegisterRoom = {
        id: props.isOperatingRoomReservation
          ? (roomFound as ISurgeryRoom).id_Quirofano
          : (roomFound as IHospitalRoom).id_Cuarto,
        nombre: roomFound.nombre,
        id_TipoCuarto: props.isOperatingRoomReservation
          ? (roomFound as ISurgeryRoom).id_TipoQuirofano
          : (roomFound as IHospitalRoom).id_TipoCuarto,
        precio: 0,
        horaFin: endDate,
        horaInicio: startTime,
        provisionalId: uuidv4(),
      };
      setRoomValues([...roomValues, roomObj]);
    }
    setValueRooms('endDate', dayjs(appointmentEndDate));
    setValueRooms('startTime', dayjs(appointmentStartDate));
    setValueRooms('room', '');
  };

  console.log({ roomValues });
  const onSubmitProcedures = async () => {
    if (roomValues.length < 1) return toast.warning('Es necesario agregar un cuarto para continuar');

    let startDate = roomValues[0].horaInicio;
    for (let i = 1; i < roomValues.length; i++) {
      if (roomValues[i].horaInicio < startDate) {
        startDate = roomValues[i].horaInicio;
      }
    }
    setStartDateSurgery(startDate);
    const roomObj = roomValues
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
    if (props.isEdit) {
      Swal.fire({
        title: 'Los espacios reservados son correctos?',
        text: 'Verifica que los espacios reservados estén correctamente asignados.',
        icon: 'question',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            await addHospitalizationSpace({
              registroEspacioHospitalario: {
                id_EspacioHospitalario: roomValues[0].id,
                horaFin: roomValues[0].horaFin,
                horaInicio: roomValues[0].horaInicio,
              },
              id_CuentaPaciente: props.patientAccountId,
            });
            Swal.fire({
              title: 'Reservación exitosa!',
              text: 'Los espacios reservados ha sido guardado correctamente.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            }).finally(() => {
              if (props.setEvents) {
                props.setEvents(roomObj);
              }
              clearAllData();
              refetch();
              props.setOpen(false);
            });
          } catch (error) {
            Swal.fire({
              title: 'Error al guardar los espacios!',
              text: 'Hubo un error al guardar los espacios reservados. Intente nuevamente.',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });
          }
        }
      });
    } else {
      toast.success('Datos registrados correctamente!');
      setStep(step + 1);
    }
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

  useEffect(() => {
    return () => {
      if (props.isEdit) {
        clearAllData();
      }
    };
  }, []);

  const hasSelectedRoom = () => {
    return roomValues.length > 0;
  };

  if (isLoading)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <HeaderModal setOpen={props.setOpen} title="Seleccione un horario" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          overflowY: 'auto',
          maxHeight: { xs: 500, md: 600 },
        }}
      >
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>
            Fecha seleccionada: {appointmentStartDate.toLocaleDateString()} - {appointmentEndDate.toLocaleDateString()}
          </Typography>
        </Box>
        <form onSubmit={handleSubmitRooms(onSubmitRooms)}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={4}>
              <Typography>
                {props.isOperatingRoomReservation ? 'Quirófanos disponibles' : 'Habitaciones disponibles'}
              </Typography>
              <TextField
                select
                label={props.isOperatingRoomReservation ? 'Quirófanos' : 'Habitaciones'}
                fullWidth
                {...registerRooms('room')}
                value={watchRoomId}
                error={!!errorsRooms.room?.message}
                helperText={errorsRooms.room?.message || (hasSelectedRoom() ? 'Ya hay un cuarto seleccionado' : '')}
                disabled={hasSelectedRoom()}
              >
                {roomsRes
                  ?.filter((rm) => {
                    const roomId = props.isOperatingRoomReservation
                      ? (rm as ISurgeryRoom).id_Quirofano
                      : (rm as IHospitalRoom).id_Cuarto;
                    return !roomValues.some((reservedRoom) => reservedRoom.id === roomId);
                  })
                  .map((rm) => (
                    <MenuItem
                      key={
                        props.isOperatingRoomReservation
                          ? (rm as ISurgeryRoom).id_Quirofano
                          : (rm as IHospitalRoom).id_Cuarto
                      }
                      value={
                        props.isOperatingRoomReservation
                          ? (rm as ISurgeryRoom).id_Quirofano
                          : (rm as IHospitalRoom).id_Cuarto
                      }
                    >
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
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Button variant="outlined" type="button" onClick={handleSubmitRooms(onSubmitRooms)}>
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        <RoomReservationTable isOperatingRoomReservation={props.isOperatingRoomReservation} />
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
        <Button variant="contained" onClick={onSubmitProcedures}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};
