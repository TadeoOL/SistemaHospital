import { Box, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer, SlotInfo, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { usePatientEntryRegisterStepsStore } from '../../../../../../store/admission/usePatientEntryRegisterSteps';
import { SpaceReservationModal } from '../SpaceReservationModal';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/es-mx';
import classNames from 'classnames';
import { IEventsCalendar } from '../../../../../../types/types';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';

dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.locale('es-mx');

const localizer = dayjsLocalizer(dayjs);

export const CalendarHospitalizationPatientRegisterComponent = () => {
  const [view, setView] = useState<View>('month');
  const setAppointmentEndDate = usePatientEntryRegisterStepsStore((state) => state.setAppointmentEndDate);
  const setAppointmentStartDate = usePatientEntryRegisterStepsStore((state) => state.setAppointmentStartDate);
  const events = usePatientEntryRegisterStepsStore((state) => state.hospitalizationEvents);
  const [myEvents, setMyEvents] = useState<IEventsCalendar[]>([]);
  const [open, setOpen] = useState(false);

  const convertEventsToDateObjects = (events: IEventsCalendar[]) => {
    return events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  };

  const handleClickSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    const now = new Date();

    if (start < now) {
      toast.warning('No se puede poner una cita anterior a la fecha actual');
      return;
    }

    if (view === 'month') {
      const newEnd = new Date(start);
      newEnd.setHours(newEnd.getHours() + 3);
      setAppointmentEndDate(newEnd);
    } else {
      setAppointmentEndDate(end);
    }

    setAppointmentStartDate(start);
    setOpen(true);
  };

  const eventStyleGetter = (event: IEventsCalendar) => {
    const backgroundColor = event.source === 'local' ? '#ff7f50' : event.title === 'Limpieza' ? '#f47f50' : '#3174ad';

    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const now = new Date();
    const isBeforeToday = date < now;

    return {
      className: classNames({
        'rbc-off-range-bg': isBeforeToday,
      }),
      style: isBeforeToday
        ? {
            pointerEvents: 'none' as const,
          }
        : {},
    };
  };

  useEffect(() => {
    if (view === 'month') {
      const eventsWithoutCleanRooms = events.filter((event) => event.title.toLowerCase() !== 'limpieza');
      const convertedEvents = convertEventsToDateObjects(eventsWithoutCleanRooms);
      setMyEvents(convertedEvents);
    } else {
      const convertedEvents = convertEventsToDateObjects(events);
      setMyEvents(convertedEvents);
    }
  }, [events, view]);

  return (
    <>
      <Box sx={{ maxHeight: 700 }}>
        <Calendar
          view={view}
          localizer={localizer}
          style={{ width: '100%', height: view === 'month' ? 700 : '100%' }}
          views={['day', 'week', 'month']}
          selectable
          step={15}
          dayPropGetter={dayPropGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          events={myEvents}
          onView={setView}
          onSelectSlot={handleClickSlot}
          eventPropGetter={eventStyleGetter}
          showMultiDayTimes={true}
          messages={{
            showMore: (count) => `${count} citas más`,
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            allDay: 'Todo el día',
            yesterday: 'Ayer',
            noEventsInRange: 'No hay eventos',
          }}
        />
      </Box>
      <Modal open={open}>
        <SpaceReservationModal setOpen={setOpen} roomType={HospitalSpaceType.Room} />
      </Modal>
    </>
  );
};
