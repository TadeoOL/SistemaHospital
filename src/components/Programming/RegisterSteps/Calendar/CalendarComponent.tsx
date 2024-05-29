import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { Modal } from '@mui/material';
import { useState } from 'react';
import { useProgrammingRegisterStore } from '../../../../store/programming/programmingRegister';
import { RoomReservationModal } from '../RoomReservationModal';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { IEventsCalendar } from '../../../../types/types';
import { ManyEventsModal } from '../EventsModal/ManyEventsModal';
import { EventDetailsModal } from '../EventsModal/EventDetailsModal';
dayjs.locale('es');

interface CalendarComponentProps {
  date: any;
  events: IEventsCalendar[];
}

export const CalendarComponent = (props: CalendarComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  const [open, setOpen] = useState(false);
  const [openManyEvents, setOpenManyEvents] = useState(false);
  const [openSpecificEvent, setOpenSpecificEvent] = useState(false);
  const setAppointmentDate = useProgrammingRegisterStore((state) => state.setAppointmentDate);
  const [date, setDate] = useState(props.date);
  const [specificEventId, setSpecificEventId] = useState('');

  const handleClickSlot = (day: Date) => {
    const now = dayjs();
    if (dayjs(day).isBefore(now, 'day')) {
      toast.warning('No se puede poner una cita en una fecha anterior');
      return;
    }
    setAppointmentDate(day);
    setOpen(true);
  };

  const dayPropGetter = (date: Date) => {
    const now = dayjs();
    const isBeforeToday = dayjs(date).isBefore(now, 'day');
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
    let backgroundColor = event.source === 'local' ? '#ff7f50' : '#3174ad';
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

  return (
    <>
      <Calendar
        localizer={localizer}
        // views={['month']}
        // toolbar={false}
        events={props.events}
        style={{ width: 700, height: 500 }}
        defaultView={'month'}
        selectable={true}
        date={date}
        onNavigate={(date) => {
          setDate(date);
        }}
        onSelectSlot={(slot) => handleClickSlot(dayjs(slot.slots[0]).toDate())}
        dayPropGetter={dayPropGetter}
        onSelectEvent={(e) => {
          if (e.source) return toast.warning('Todavía no hay información respecto a este evento!');
          setSpecificEventId(e.id);
          setOpenSpecificEvent(true);
        }}
        onShowMore={() => setOpenManyEvents(true)}
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
        }}
      />
      <Modal open={open}>
        <>
          <RoomReservationModal setOpen={setOpen} />
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
    </>
  );
};
