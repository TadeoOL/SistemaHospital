import dayjs from 'dayjs';
import { Calendar, NavigateAction, SlotInfo, View, Views, dayjsLocalizer, stringOrDate } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { Box, CircularProgress, Modal } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useProgrammingRegisterStore } from '../../../../store/programming/programmingRegister';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { IEventsCalendar } from '../../../../types/types';
import { ManyEventsModal } from '../EventsModal/ManyEventsModal';
import { EventDetailsModal } from '../EventsModal/EventDetailsModal';
import { RegisterSteps } from '../RegisterSteps';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { modifyEventRoom } from '../../../../services/programming/admissionRegisterService';
import 'dayjs/locale/es-mx';
dayjs.locale('es-mx');
import Swal from 'sweetalert2';

interface CalendarComponentProps {
  date: Date;
  events: IEventsCalendar[];
  calendarHeight?: number | string;
  calendarWidth?: number | string;
  setDate: Function;
  setEvents: Function;
  isOperatingRoomReservation?: boolean;
}
const DnDCalendar = withDragAndDrop(Calendar);

export const CalendarComponent = (props: CalendarComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  const [open, setOpen] = useState(false);
  const [openManyEvents, setOpenManyEvents] = useState(false);
  const [openSpecificEvent, setOpenSpecificEvent] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const setAppointmentStartDate = useProgrammingRegisterStore((state) => state.setAppointmentStartDate);
  const setAppointmentEndDate = useProgrammingRegisterStore((state) => state.setAppointmentEndDate);
  const [view, setView] = useState<View>('month');
  const [specificEventId, setSpecificEventId] = useState('');
  const [myEvents, setMyEvents] = useState<IEventsCalendar[]>(props.events);
  const [hashCleanRoomEvents, setHashCleanRoomEvents] = useState<{ [key: string]: IEventsCalendar }>({});

  const handleClickSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    const now = dayjs();
    if (dayjs(end).isBefore(now, 'seconds')) {
      toast.warning('No se puede poner una cita posterior a la fecha actual');
      return;
    }
    if (view == 'month') {
      const newEnd = dayjs(start).add(3, 'hours').toDate();
      setAppointmentEndDate(newEnd);
    } else {
      setAppointmentEndDate(end);
    }
    setAppointmentStartDate(start);
    setOpen(true);
  };

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
              timer: 1000,
              showConfirmButton: false,
            });
          } catch (error) {
            console.log({ error });
            Swal.fire({
              title: 'Error al modificar la cita',
              text: 'Hubo un error al intentar cambiar la fecha del evento.',
              icon: 'error',
              timer: 1000,
              showConfirmButton: false,
            });
            // const errorMsg = error as any;
            // toast.error(errorMsg.response.data as string);
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

  if (isFiltering)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <Box>
      <DnDCalendar
        localizer={localizer}
        views={['day', 'week', 'month']}
        view={view}
        onView={(v) => setView(v)}
        defaultView={Views.MONTH}
        step={15}
        resizable
        formats={{
          timeGutterFormat: 'HH:mm',
        }}
        events={myEvents}
        style={{
          width: '100%',
          height: view === 'month' ? (props.calendarHeight ? props.calendarHeight : 700) : '100%',
        }}
        selectable
        enableAutoScroll={false}
        date={props.date}
        draggableAccessor={(event: any) => {
          return event.title !== 'Limpieza';
        }}
        scrollToTime={dayjs().set('hour', 5).set('minute', 0).toDate()}
        onNavigate={onNavigate}
        onSelectSlot={(slot) => handleClickSlot(slot)}
        dayPropGetter={dayPropGetter}
        onSelectEvent={(e: any) => {
          if (e.source) return toast.warning('Todavía no hay información respecto a este evento!');
          if (e.title.toLowerCase() === 'limpieza') return;
          setSpecificEventId(e.id);
          setOpenSpecificEvent(true);
        }}
        onShowMore={(_, date) => {
          props.setDate(date);
          setView('day');
        }}
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
        // endAccessor={({ end }) => new Date(end.getTime() - 1)}
        showMultiDayTimes={true}
      />
      <Modal open={open}>
        <>
          <RegisterSteps setOpen={setOpen} isOperatingRoomReservation={props.isOperatingRoomReservation} />
        </>
      </Modal>
      <Modal open={openManyEvents}>
        <>
          <ManyEventsModal setOpen={setOpenManyEvents} />
        </>
      </Modal>
      <Modal open={openSpecificEvent}>
        <>
          <EventDetailsModal setOpen={setOpenSpecificEvent} eventId={specificEventId} />
        </>
      </Modal>
    </Box>
  );
};
