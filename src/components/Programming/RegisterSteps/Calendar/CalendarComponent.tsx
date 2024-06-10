import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Calendar, SlotInfo, View, Views, dayjsLocalizer, stringOrDate } from 'react-big-calendar';
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
dayjs.locale('es-mx');

interface CalendarComponentProps {
  date: Date;
  events: IEventsCalendar[];
  calendarHeight?: number | string;
  calendarWidth?: number | string;
  setDate: Function;
  setEvents: Function;
}
const DnDCalendar = withDragAndDrop(Calendar);

export const CalendarComponent = (props: CalendarComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  const [open, setOpen] = useState(false);
  const [openManyEvents, setOpenManyEvents] = useState(false);
  const [openSpecificEvent, setOpenSpecificEvent] = useState(false);
  const [isFiltering, setIsFiltering] = useState(true);
  const setAppointmentStartDate = useProgrammingRegisterStore((state) => state.setAppointmentStartDate);
  const setAppointmentEndDate = useProgrammingRegisterStore((state) => state.setAppointmentEndDate);
  const [view, setView] = useState<View>('month');
  const [specificEventId, setSpecificEventId] = useState('');
  const [myEvents, setMyEvents] = useState<IEventsCalendar[]>(props.events);

  const handleClickSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    const now = dayjs();
    if (dayjs(start).isBefore(now, 'seconds')) {
      toast.warning('No se puede poner una cita posterior a la fecha actual');
      return;
    }
    setAppointmentStartDate(start);
    setAppointmentEndDate(end);
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
    (newDate: Date, view: View) => {
      const dateJs = dayjs(props.date).format('DD/MM/YYYY HH:mm:ss');
      const newDateJs = dayjs(newDate).format('DD/MM/YYYY HH:mm:ss');
      if (dateJs === newDateJs) return;
      setView(view);
      props.setDate(newDate);
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
      try {
        await modifyEventRoom(eventObj);
        const existing = myEvents.find((ev) => ev.id === event.id);
        const cleanRoom = myEvents.find((ev) => ev.roomId === event.id);
        const filtered = myEvents.filter((ev) => ev.id !== event.id).filter((ev) => ev.roomId !== event.id);
        if (!existing || !cleanRoom) return [...myEvents];
        const cleanRoomDuration = cleanRoom.end.getTime() - cleanRoom.start.getTime();
        const newEndCleanRoom = new Date((drop.end as Date).getTime() + cleanRoomDuration);
        props.setEvents([
          ...filtered,
          { ...existing, start: drop.start as Date, end: drop.end as Date },
          { ...cleanRoom, start: drop.end as Date, end: newEndCleanRoom },
        ]);
      } catch (error) {
        const errorMsg = error as any;
        toast.error(errorMsg.response.data as string);
      }
    },
    [myEvents]
  );

  useEffect(() => {
    setMyEvents(props.events);
  }, [props.events]);

  useEffect(() => {
    if (view === 'month') {
      const eventsWithoutCleanRooms = props.events.filter((event) => event.title.toLocaleLowerCase() !== 'limpieza');
      setMyEvents(eventsWithoutCleanRooms);
    } else {
      setMyEvents(props.events);
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
          height: view === 'month' ? 700 : '100%',
        }}
        selectable={true}
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
      />
      <Modal open={open}>
        <>
          <RegisterSteps setOpen={setOpen} />
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