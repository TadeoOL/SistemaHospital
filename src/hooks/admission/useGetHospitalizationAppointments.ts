import { useEffect, useState } from 'react';
import { getRoomsEventsByDate } from '../../services/programming/roomsService';
// import { usePatientRegisterPaginationStore } from '../../store/programming/patientRegisterPagination';
import { IEventsCalendar } from '../../types/types';

export const useGetHospitalizationAppointments = (
  date: Date,
  setEvents: Function,
  events: IEventsCalendar[],
  roomType: number,
  originalEvents: IEventsCalendar[],
  setOriginalEvents: Function
) => {
  // const fetchEvents = useProgrammingRegisterStore((state) => state.fetchEvents);
  const [isLoading, setIsLoading] = useState(false);
  // const eventsFetched = usePatientRegisterPaginationStore((state) => state.data);
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const formattedDate = date.toISOString();
        const res = await getRoomsEventsByDate(formattedDate, roomType);
        if (res.length > 0) {
          const formattedRes = res.map((event) => {
            return {
              id: event.id,
              roomId: event.id_Cuarto,
              title: event.nombre,
              start: new Date(event.fechaInicio),
              end: new Date(event.fechaFin),
            };
          });
          // const eventsFiltered = events.filter((e) => !formattedRes.some((resEvent) => resEvent.id === e.id));
          setEvents([...formattedRes]);
          setOriginalEvents([...formattedRes]);
        } else {
          setEvents([...events]);
          setOriginalEvents([...originalEvents]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [date]);
  return {
    isLoading,
  };
};
