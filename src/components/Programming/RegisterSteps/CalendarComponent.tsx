import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

interface CalendarComponentProps {
  date: any;
}
export const CalendarComponent = (props: CalendarComponentProps) => {
  const localizer = dayjsLocalizer(dayjs);
  return (
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
      onSelectSlot={(slot) => console.log(dayjs(slot.slots[0]).toDate().toLocaleDateString())}
    />
  );
};
