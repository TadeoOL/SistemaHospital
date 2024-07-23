import { useEffect, useState } from 'react';
import { useProgrammingRegisterStore } from '../../store/programming/programmingRegister';
import { getRoomsEventsByDate } from '../../services/programming/roomsService';
import { usePatientRegisterPaginationStore } from '../../store/programming/patientRegisterPagination';

export const useGetDate = (date: Date) => {
  const events = useProgrammingRegisterStore((state) => state.events);
  const setEvents = useProgrammingRegisterStore((state) => state.setEvents);
  // const fetchEvents = useProgrammingRegisterStore((state) => state.fetchEvents);
  const [isLoading, setIsLoading] = useState(false);
  const eventsFetched = usePatientRegisterPaginationStore((state) => state.data);
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const formattedDate = date.toISOString();
        const res = await getRoomsEventsByDate(formattedDate);
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
        } else {
          setEvents([...events]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [date, eventsFetched]);
  return {
    isLoading,
  };
};
