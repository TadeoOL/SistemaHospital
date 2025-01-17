import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useState } from 'react';
import { Calendar, NavigateAction, SlotInfo, View, Views, dayjsLocalizer, stringOrDate } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IAnesthesiologistShift } from '../../../types/hospitalizationTypes';
import { toast } from 'react-toastify';
import { AnesthesiologistShiftRegisterModal } from './Modal/AnesthesiologistShiftRegisterModal';
import {
  getRegisteredAnesthesiologistShifts,
  modifyAnesthesiologistShifts,
} from '../../../services/hospitalization/anesthesiologistShift';
import 'dayjs/locale/es-mx';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { AnesthesiologistShiftInfoModal } from './Modal/AnesthesiologistShiftInfoModal';
import { useQuery } from '@tanstack/react-query';
dayjs.locale('es-mx');

const CALENDAR_STEP = 30;

const eventStyleGetter = (event: any) => {
  let backgroundColor = event.source === 'local' ? '#ff7f50' : event.title === 'Limpieza' ? '#f47f50' : '#3174ad';
  let style = {
    backgroundColor: backgroundColor,
    borderRadius: '5px',
    opacity: 0.8,
    border: 'none',
  };

  return {
    style,
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

const useGetAnesthesiologistShiftEvents = (date: Date, newEvent: boolean) => {
  const {
    data = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['anesthesiologistShiftEvents', date, newEvent],
    queryFn: () => getRegisteredAnesthesiologistShifts(date),
  });

  return {
    loading,
    events: data as IAnesthesiologistShift[],
    error,
  };
};

const DnDCalendar = withDragAndDrop(Calendar);
export const AnesthesiologistShiftCalendar = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [view, setView] = useState<View>('month');
  const [open, setOpen] = useState(false);
  const [openShiftInfo, setOpenShiftInfo] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [date, setDate] = useState<Date>(new Date());
  const [newEventAdded, setNewEventAdded] = useState(false);
  const { events, loading } = useGetAnesthesiologistShiftEvents(date, newEventAdded);
  const [eventSelected, setEventSelected] = useState<{
    id: string;
    id_Anestesiologo: string;
    title: string;
    start: Date;
    end: Date;
  }>();

  const myEvents = events.map((e) => {
    return {
      id: e.id,
      id_Anestesiologo: e.id_Anestesiologo,
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
      const event = drop.event as IAnesthesiologistShift;
      if (dayjs(drop.start).format('DD/MM/YYYY - HH:mm:ss') === dayjs(drop.end).format('DD/MM/YYYY - HH:mm:ss'))
        return toast.warning('La hora de inicio no puede ser igual a la hora de finalización.');
      if (dayjs(drop.start).isBefore(now, 'seconds'))
        return toast.warning('La hora de comienzo no puede ser menor a la hora actual');
      const eventObj = {
        id: event.id,
        id_Anestesiologo: event.id_Anestesiologo,
        fechaInicio: drop.start as Date,
        fechaFin: drop.end as Date,
      };
      try {
        await modifyAnesthesiologistShifts(eventObj);
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
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>Calendario de guardias de anestesiologos.</Typography>
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
          enableAutoScroll={false}
          scrollToTime={dayjs().set('hour', 5).set('minute', 0).toDate()}
          // onNavigate={onNavigate}
          onSelectSlot={(slot) => handleClickSlot(slot)}
          dayPropGetter={dayPropGetter}
          onSelectEvent={(e: any) => {
            setEventSelected(e);
            setOpenShiftInfo(true);
            // if (e.source) return toast.warning('Todavía no hay información respecto a este evento!');
            // if (e.title.toLowerCase() === 'limpieza') return;
            // setSpecificEventId(e.id);
            // setOpenSpecificEvent(true);
          }}
          onShowMore={(_, date) => {
            setDate(date);
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
          showMultiDayTimes={true}
        />
      </Box>
      <Modal open={open} onClose={() => setOpen(!open)}>
        <>
          <AnesthesiologistShiftRegisterModal
            setOpen={setOpen}
            start={start}
            end={end}
            newEventAdded={newEventAdded}
            setNewEventAdded={setNewEventAdded}
          />
        </>
      </Modal>
      <Modal open={openShiftInfo} onClose={() => setOpenShiftInfo(false)}>
        <>
          <AnesthesiologistShiftInfoModal
            setOpen={setOpenShiftInfo}
            anesthesiologistName={eventSelected?.title as string}
            endShift={eventSelected?.end as Date}
            startShift={eventSelected?.start as Date}
            shiftId={eventSelected?.id as string}
          />
        </>
      </Modal>
    </>
  );
};
