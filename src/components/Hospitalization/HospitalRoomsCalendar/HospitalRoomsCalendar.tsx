import { Backdrop, Box, CircularProgress, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer, NavigateAction, View, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHospitalizationRoomsCalendar } from '../../../hooks/hospitalization/useGetHospitalizationRoomsCalendar';
import { useCallback, useEffect, useState } from 'react';
import { EventDetailsModal } from '../../Programming/RegisterSteps/EventsModal/EventDetailsModal';
import { IEventsCalendar } from '../../../types/types';
dayjs.locale('es-mx');

export const HospitalRoomsCalendar = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [now, setNow] = useState(dayjs());
  const [eventId, setEventId] = useState('');
  const [openEvent, setOpenEvent] = useState(false);
  const [view, setView] = useState<View>('month');
  const [events, setEvents] = useState<IEventsCalendar[]>([]);
  const { data, isLoading } = useGetHospitalizationRoomsCalendar(now.toDate());

  useEffect(() => {
    if (!data) return;

    const existingEventIds = events.map((event) => event.id);

    const newEvents = data
      .filter((event) => !existingEventIds.includes(event.id))
      .map((event) => ({
        title: event.nombre,
        start: new Date(event.inicio),
        end: new Date(event.fin),
        id: event.id,
        roomId: event.id_Cuarto,
      }));

    setEvents((prevEvents) => {
      const mergedEvents = [...prevEvents];

      newEvents.forEach((newEvent) => {
        const existingEventIndex = mergedEvents.findIndex((event) => event.id === newEvent.id);

        if (existingEventIndex === -1) {
          mergedEvents.push(newEvent);
        } else {
          mergedEvents[existingEventIndex] = newEvent;
        }
      });

      return mergedEvents;
    });
  }, [data]);

  const onNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      const dateJs = dayjs(now).format('DD/MM/YYYY HH:mm:ss');
      const newDateJs = dayjs(newDate).format('DD/MM/YYYY HH:mm:ss');
      if (dateJs === newDateJs) return;
      if (action === 'DATE') {
        setView('day');
      } else {
        setView(view);
      }
      setNow(dayjs(newDate));
    },
    [now]
  );

  if (isLoading && events.length === 0)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 4,
          boxShadow: 4,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Calendar
          localizer={localizer}
          views={['day', 'week', 'month']}
          view={view}
          onView={(v) => setView(v)}
          defaultView={Views.MONTH}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          events={events}
          style={{
            width: '100%',
            height: '760px',
          }}
          // date={new Date()}
          onNavigate={onNavigate}
          // onSelectSlot={(slot) => handleClickSlot(slot)}
          // dayPropGetter={dayPropGetter}
          onSelectEvent={(e: any) => {
            if (e.title.toLowerCase() === 'limpieza') return;
            setEventId(e.id);
            setOpenEvent(true);
          }}
          // onShowMore={(_, date) => {
          //   props.setDate(date);
          //   setView('day');
          // }}
          // eventPropGetter={eventStyleGetter}
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
        />
      </Box>
      <Modal open={openEvent}>
        <>
          <EventDetailsModal setOpen={setOpenEvent} eventId={eventId} />
        </>
      </Modal>
    </>
  );
};
