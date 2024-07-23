import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, NavigateAction, SlotInfo, View, Views, dayjsLocalizer, stringOrDate } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { MedicalShiftRegisterModal } from './Modal/MedicalShiftRegisterModal';
import { IMedicalShift } from '../../../types/hospitalizationTypes';
import { getRegisteredMedicalShifts, modifyMedicalShifts } from '../../../services/hospitalization/medicalShift';
import { toast } from 'react-toastify';
import 'dayjs/locale/es';
dayjs.locale('es-mx');

const DnDCalendar = withDragAndDrop(Calendar);
const CALENDAR_STEP = 30;

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

const useGetMedicalShiftEvents = (date: Date, newEvent: boolean) => {
  const [events, setEvents] = useState<IMedicalShift[]>([]);
  const [loading, setLoading] = useState(true);

  const getMedicalShiftEvents = async () => {
    try {
      const res = await getRegisteredMedicalShifts(date);
      setEvents(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedicalShiftEvents();
  }, [date, newEvent]);

  return {
    loading,
    events,
  };
};

export const MedicalShiftCalendar = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [view, setView] = useState<View>('month');
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [date, setDate] = useState<Date>(new Date());
  const [newEventAdded, setNewEventAdded] = useState(false);
  const { events, loading } = useGetMedicalShiftEvents(date, newEventAdded);
  const myEvents = events.map((e) => {
    return {
      id: e.id,
      id_Medico: e.id_Medico,
      title: e.nombre,
      start: new Date(e.fechaInicio),
      end: new Date(e.fechaFin),
    };
  });

  const handleClickSlot = (slot: SlotInfo) => {
    const today = dayjs();

    if (dayjs(slot.end).isBefore(today, 'seconds')) {
      return;
    }
    setStart(slot.start);
    setEnd(slot.end);
    setOpen(!open);
  };

  const onNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      const dateJs = dayjs(date).format('DD/MM/YYYY HH:mm:ss');
      const newDateJs = dayjs(newDate).format('DD/MM/YYYY HH:mm:ss');
      if (dateJs === newDateJs) return;
      if (action === 'DATE') {
        setView('day');
      } else {
        setView(view);
      }
      setDate(dayjs(newDate).toDate());
    },
    [date]
  );

  const eventModify = useCallback(
    async (drop: { event: any; start: stringOrDate; end: stringOrDate; isAllDay?: boolean }) => {
      const now = dayjs();
      const event = drop.event as IMedicalShift;
      if (dayjs(drop.start).format('DD/MM/YYYY - HH:mm:ss') === dayjs(drop.end).format('DD/MM/YYYY - HH:mm:ss'))
        return toast.warning('La hora de inicio no puede ser igual a la hora de finalización.');
      if (dayjs(drop.start).isBefore(now, 'seconds'))
        return toast.warning('La hora de comienzo no puede ser menor a la hora actual');
      const eventObj = {
        id: event.id,
        id_Medico: event.id_Medico,
        fechaInicio: drop.start as Date,
        fechaFin: drop.end as Date,
      };
      try {
        await modifyMedicalShifts(eventObj);
        setNewEventAdded(!newEventAdded);
      } catch (error) {
        const errorMsg = error as any;
        toast.error(errorMsg.response.data.message[0] as string);
      }
    },
    [myEvents, newEventAdded]
  );

  if (loading)
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 5, boxShadow: 5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>Calendario de guardias de medicos.</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month']}
              label="Año y Mes"
              onMonthChange={(e: Dayjs) => {
                setDate(e.toDate());
              }}
              value={dayjs(date)}
            />
          </LocalizationProvider>
        </Box>
        <DnDCalendar
          localizer={localizer}
          views={['day', 'week', 'month']}
          view={view}
          onView={(v) => setView(v)}
          defaultView={Views.MONTH}
          onNavigate={onNavigate}
          step={CALENDAR_STEP}
          resizable={true}
          events={myEvents}
          date={date}
          formats={{
            timeGutterFormat: 'HH:mm',
          }}
          style={{
            width: '100%',
            height: view === 'month' ? 700 : '100%',
          }}
          selectable={true}
          draggableAccessor={(event: any) => {
            return event.title !== 'Limpieza';
          }}
          scrollToTime={dayjs().set('hour', 5).set('minute', 0).toDate()}
          // onNavigate={onNavigate}
          onSelectSlot={(slot) => handleClickSlot(slot)}
          dayPropGetter={dayPropGetter}
          onSelectEvent={(e: any) => {
            console.log({ e });
            // if (e.source) return toast.warning('Todavía no hay información respecto a este evento!');
            // if (e.title.toLowerCase() === 'limpieza') return;
            // setSpecificEventId(e.id);
            // setOpenSpecificEvent(true);
          }}
          // onShowMore={(_, date) => {
          //   props.setDate(date);
          //   setView('day');
          // }}
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
      <Modal open={open} onClose={() => setOpen(!open)}>
        <>
          <MedicalShiftRegisterModal
            setOpen={setOpen}
            start={start}
            end={end}
            newEventAdded={newEventAdded}
            setNewEventAdded={setNewEventAdded}
          />
        </>
      </Modal>
    </>
  );
};
