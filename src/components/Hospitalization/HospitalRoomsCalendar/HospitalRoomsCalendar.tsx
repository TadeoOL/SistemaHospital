import { Box, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHospitalizationRoomsCalendar } from '../../../hooks/hospitalization/useGetHospitalizationRoomsCalendar';
import { useState } from 'react';
import { EventDetailsModal } from '../../Programming/RegisterSteps/EventsModal/EventDetailsModal';

export const HospitalRoomsCalendar = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [now, setNow] = useState(new Date());
  const [eventId, setEventId] = useState('');
  const [openEvent, setOpenEvent] = useState(false);
  const { data, isLoading } = useGetHospitalizationRoomsCalendar(now);

  const events =
    data?.map((event) => {
      return {
        title: event.nombre,
        start: new Date(event.inicio),
        end: new Date(event.fin),
        id: event.id,
        roomId: event.id_Cuarto,
      };
    }) ?? [];

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
          // view={view}
          // onView={(v) => setView(v)}
          // defaultView={Views.MONTH}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          events={events}
          style={{
            width: '100%',
            height: '760px',
          }}
          date={new Date()}
          // onNavigate={onNavigate}
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
