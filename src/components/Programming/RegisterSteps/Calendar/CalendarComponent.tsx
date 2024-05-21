import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { Modal } from '@mui/material';
import { useState } from 'react';
import { useProgrammingRegisterStore } from '../../../../store/programming/programmingRegister';
import { RoomReservationModal } from '../RoomReservationModal';
dayjs.locale('es');

interface CalendarComponentProps {
  date: any;
}
export const CalendarComponent = (props: CalendarComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  const [open, setOpen] = useState(false);
  const setAppointmentDate = useProgrammingRegisterStore((state) => state.setAppointmentDate);

  const handleClickSlot = (day: Date) => {
    setAppointmentDate(day);
    setOpen(true);
  };
  return (
    <>
      <Calendar
        localizer={localizer}
        views={['month']}
        toolbar={false}
        style={{ width: 700, height: 500 }}
        events={[
          {
            time: '12',
            day: 13,
            title: 'hiii',
          },
        ]}
        defaultView={'month'}
        selectable={true}
        date={dayjs(props.date).toDate()}
        onSelectSlot={(slot) => handleClickSlot(dayjs(slot.slots[0]).toDate())}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <RoomReservationModal />
        </>
      </Modal>
    </>
  );
};
