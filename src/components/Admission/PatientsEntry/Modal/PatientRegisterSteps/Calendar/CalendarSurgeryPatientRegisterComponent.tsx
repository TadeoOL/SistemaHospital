import { Box, CircularProgress, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer, NavigateAction, SlotInfo, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { usePatientEntryRegisterStepsStore } from '../../../../../../store/admission/usePatientEntryRegisterSteps';
import { SpaceReservationModal } from '../SpaceReservationModal';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es-mx';
import classNames from 'classnames';
import { IEventsCalendar } from '../../../../../../types/types';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';
dayjs.extend(localizedFormat);
dayjs.locale('es-MX');

interface CalendarSurgeryPatientRegisterComponentProps {
  day: Date;
  setDay: Function;
}
export const CalendarSurgeryPatientRegisterComponent = ({
  day,
  setDay,
}: CalendarSurgeryPatientRegisterComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  const [view, setView] = useState<View>('month');
  const setAppointmentEndDate = usePatientEntryRegisterStepsStore((state) => state.setAppointmentEndDate);
  const setAppointmentStartDate = usePatientEntryRegisterStepsStore((state) => state.setAppointmentStartDate);
  const events = usePatientEntryRegisterStepsStore((state) => state.surgeryEvents);
  // const setEvents = usePatientEntryRegisterStepsStore((state) => state.setSurgeryEvents);
  // const [hashCleanRoomEvents, setHashCleanRoomEvents] = useState<{ [key: string]: IEventsCalendar }>({});
  const [myEvents, setMyEvents] = useState<IEventsCalendar[]>([]);
  const [filteringEvents, setFilteringEvents] = useState(true);

  const [open, setOpen] = useState(false);

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

  const onNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      const dateJs = dayjs(day).format('DD/MM/YYYY HH:mm:ss');
      const newDateJs = dayjs(newDate).format('DD/MM/YYYY HH:mm:ss');
      if (dateJs === newDateJs) return;
      if (action === 'DATE') {
        setView('day');
      } else {
        setView(view);
      }
      setDay(dayjs(newDate));
    },
    [day]
  );

  useEffect(() => {
    setFilteringEvents(true);
    const newHashCleanRoomEvents: { [key: string]: IEventsCalendar } = {};
    if (view === 'month') {
      const eventsWithoutCleanRooms = events.filter((event) => event.title.toLocaleLowerCase() !== 'limpieza');
      for (let i = 0; i < events.length; i++) {
        if (i % 2 !== 0) {
          newHashCleanRoomEvents[events[i - 1].id] = events[i];
        }
      }
      setMyEvents(eventsWithoutCleanRooms);
      // setHashCleanRoomEvents(newHashCleanRoomEvents);
    } else {
      setMyEvents(events);
      // setHashCleanRoomEvents(newHashCleanRoomEvents);
    }
    setFilteringEvents(false);
    // setIsFiltering(false);
  }, [events, view]);

  if (filteringEvents)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Box sx={{ maxHeight: 700 }}>
        <Calendar
          view={view}
          localizer={localizer}
          style={{ width: '100%', height: view == 'month' ? 700 : '100%' }}
          views={['day', 'week', 'month']}
          date={day}
          onNavigate={onNavigate}
          selectable
          step={15}
          dayPropGetter={dayPropGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          events={myEvents}
          onView={(v) => setView(v)}
          onSelectSlot={(slot) => handleClickSlot(slot)}
          eventPropGetter={eventStyleGetter}
          showMultiDayTimes={true}
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
      <Modal open={open}>
        <>
          <SpaceReservationModal setOpen={setOpen} roomType={HospitalSpaceType.OperatingRoom} />
        </>
      </Modal>
    </>
  );
};
