import { useCallback, useEffect, useState } from 'react';
import { IEventsCalendar } from '../../../../../types/types';
import { Calendar, dayjsLocalizer, NavigateAction, SlotInfo, stringOrDate, View } from 'react-big-calendar';
import dayjs from 'dayjs';
import { Box, CircularProgress, Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { useProgrammingRegisterStore } from '../../../../../store/programming/programmingRegister';
import { RoomReservationModal } from '../../../RegisterSteps/RoomReservationModal';
import classNames from 'classnames';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Swal from 'sweetalert2';
import { modifyEventRoom } from '../../../../../services/programming/admissionRegisterService';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

interface AddEditCalendarProps {
  date: Date;
  events: IEventsCalendar[];
  calendarHeight?: number | string;
  calendarWidth?: number | string;
  setDate: Function;
  setEvents: Function;
  patientAccountId: string;
  isEdit?: boolean;
  registerRoomId?: string;
  eventView?: Date;
  refetch?: Function;
  isSurgeryRoom?: boolean;
}
const dayPropGetter = (date: Date) => {
  const now = dayjs();
  const isBeforeToday = dayjs(date).isBefore(now, 'seconds');
  return {
    className: classNames({
      'rbc-off-range-bg': isBeforeToday,
    }),
    style: isBeforeToday
      ? {
          className: 'rbc-off-range',
          pointerEvents: 'none' as 'none',
        }
      : {},
  };
};

const DnDCalendar = withDragAndDrop(Calendar);

const eventStyleGetter = (event: any) => {
  let backgroundColor = event.source === 'local' ? '#ff7f50' : event.title === 'Limpieza' ? '#f47f50' : '#3174ad';
  let style = {
    backgroundColor: backgroundColor,
    borderRadius: '0px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block',
    '&:hover': {
      backgroundColor: 'red',
      borderRadius: '0px',
      opacity: 0.2,
      color: 'white',
      border: '0px',
      display: 'block',
      cursor: 'pointer',
    },
  };
  return {
    style: style,
  };
};

export const AddEditCalendar = (props: AddEditCalendarProps) => {
  const [myEvents, setMyEvents] = useState<IEventsCalendar[]>(props.events);
  const localizer = dayjsLocalizer(dayjs);
  //   const [hashCleanRoomEvents, setHashCleanRoomEvents] = useState<{ [key: string]: IEventsCalendar }>({});
  const [view, setView] = useState<View>(props.eventView ? 'day' : 'month');
  const [isFiltering, setIsFiltering] = useState(true);
  const setAppointmentStartDate = useProgrammingRegisterStore((state) => state.setAppointmentStartDate);
  const setAppointmentEndDate = useProgrammingRegisterStore((state) => state.setAppointmentEndDate);
  const [hashCleanRoomEvents, setHashCleanRoomEvents] = useState<{ [key: string]: IEventsCalendar }>({});
  const [open, setOpen] = useState(false);

  const handleClickSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    const now = dayjs();
    if (dayjs(end).isBefore(now, 'seconds')) {
      toast.warning('No se puede poner una cita posterior a la fecha actual');
      return;
    }
    setAppointmentStartDate(start);
    setAppointmentEndDate(end);
    setOpen(true);
  };

  const onNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      const dateJs = dayjs(props.date).format('DD/MM/YYYY HH:mm:ss');
      const newDateJs = dayjs(newDate).format('DD/MM/YYYY HH:mm:ss');
      if (dateJs === newDateJs) return;
      if (action === 'DATE') {
        setView('day');
      } else {
        setView(view);
      }
      props.setDate(dayjs(newDate));
    },
    [props.date]
  );

  const eventModify = useCallback(
    async (drop: { event: any; start: stringOrDate; end: stringOrDate; isAllDay?: boolean }) => {
      const now = dayjs();
      const event = drop.event as IEventsCalendar;
      if (dayjs(drop.start).format('DD/MM/YYYY - HH:mm:ss') === dayjs(drop.end).format('DD/MM/YYYY - HH:mm:ss'))
        return toast.warning('La hora de inicio no puede ser igual a la hora de finalización.');
      if (dayjs(drop.start).isBefore(now, 'seconds'))
        return toast.warning('La hora de comienzo no puede ser menor a la hora actual');
      const eventObj = {
        id_RegistroCuarto: event.id,
        id_Cuarto: event.roomId,
        horaInicio: drop.start as Date,
        horaFin: drop.end as Date,
      };
      Swal.fire({
        title: '¿Estás seguro de cambiar la fecha?',
        text: `El cambio del evento "${event.title}" se asignara del día ${dayjs(drop.start).format('DD/MM/YYYY HH:mm:ss')} hasta ${dayjs(drop.end).format('DD/MM/YYYY HH:mm:ss')}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cambiar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            await modifyEventRoom(eventObj);
            const existing = myEvents.find((ev) => ev.id === event.id);
            const cleanRoom = myEvents.find((ev) => ev.roomId === event.id);
            const filtered = myEvents.filter((ev) => ev.id !== event.id).filter((ev) => ev.roomId !== event.id);
            if (!cleanRoom && Object.keys(hashCleanRoomEvents).length > 0) {
              const cleanRoomInHashMap = hashCleanRoomEvents[existing?.id as string];
              const cleanRoomDuration = cleanRoomInHashMap.end.getTime() - cleanRoomInHashMap.start.getTime();
              const newEndCleanRoom = new Date((drop.end as Date).getTime() + cleanRoomDuration);
              props.setEvents([
                ...filtered,
                { ...existing, start: drop.start as Date, end: drop.end as Date },
                { ...cleanRoomInHashMap, start: drop.end as Date, end: newEndCleanRoom },
              ]);
            } else if (cleanRoom) {
              const cleanRoomDuration = cleanRoom.end.getTime() - cleanRoom.start.getTime();
              const newEndCleanRoom = new Date((drop.end as Date).getTime() + cleanRoomDuration);
              props.setEvents([
                ...filtered,
                { ...existing, start: drop.start as Date, end: drop.end as Date },
                { ...cleanRoom, start: drop.end as Date, end: newEndCleanRoom },
              ]);
            } else {
              props.setEvents([...filtered, { ...existing, start: drop.start as Date, end: drop.end as Date }]);
            }
            Swal.fire({
              title: 'Cita modificada',
              text: 'La fecha del evento ha sido cambiada exitosamente.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            }).finally(() => {
              if (props.refetch) props.refetch();
            });
          } catch (error: any) {
            console.log({ error });
            Swal.fire({
              title: 'Error al modificar la cita',
              text: `${error.request.response}`,
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }
      });
    },
    [myEvents, hashCleanRoomEvents]
  );

  useEffect(() => {
    setMyEvents(props.events);
  }, [props.events]);

  useEffect(() => {
    setIsFiltering(true);
    const newHashCleanRoomEvents: { [key: string]: IEventsCalendar } = {};
    if (view === 'month') {
      const eventsWithoutCleanRooms = props.events.filter((event) => event.title.toLocaleLowerCase() !== 'limpieza');
      for (let i = 0; i < props.events.length; i++) {
        if (i % 2 !== 0) {
          newHashCleanRoomEvents[props.events[i - 1].id] = props.events[i];
        }
      }
      setMyEvents(eventsWithoutCleanRooms);
      setHashCleanRoomEvents(newHashCleanRoomEvents);
    } else {
      setMyEvents(props.events);
      setHashCleanRoomEvents(newHashCleanRoomEvents);
    }
    setIsFiltering(false);
  }, [props.events, view]);

  useEffect(() => {
    if (props.eventView) {
      props.setDate(props.eventView);
    }
  }, [props.eventView]);

  if (isFiltering)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Box>
        <DnDCalendar
          localizer={localizer}
          views={['day', 'week', 'month']}
          view={view}
          onView={(v) => setView(v)}
          defaultDate={props.eventView ? props.eventView : props.date}
          step={15}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          events={myEvents}
          style={{
            width: '100%',
            height: props.calendarHeight ? props.calendarHeight : 700,
          }}
          selectable={!props.isEdit}
          enableAutoScroll={false}
          draggableAccessor={(event: any) => {
            if (props.isEdit) {
              return event.id === props.registerRoomId;
            } else {
              return event.title !== 'Limpieza';
            }
          }}
          date={props.date}
          scrollToTime={dayjs().set('hour', 5).set('minute', 0).toDate()}
          onNavigate={onNavigate}
          onSelectSlot={(slot) => handleClickSlot(slot)}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventStyleGetter}
          messages={{
            showMore: (count) => `${count} citas mas`,
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Dia',
            allDay: 'Todo el dia',
            yesterday: 'Ayer',
            noEventsInRange: 'No hay eventos',
          }}
          onEventDrop={eventModify}
          onEventResize={eventModify}
          showMultiDayTimes={true}
        />
      </Box>
      <Modal open={open}>
        <Box sx={style}>
          <RoomReservationModal
            setOpen={setOpen}
            isEdit
            patientAccountId={props.patientAccountId}
            setEvents={setMyEvents}
            isOperatingRoomReservation={props.isSurgeryRoom}
          />
        </Box>
      </Modal>
    </>
  );
};
