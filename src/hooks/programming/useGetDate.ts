import { useEffect, useState } from 'react';
import { getRoomsEventsByDate } from '../../services/programming/roomsService';
import { usePatientRegisterPaginationStore } from '../../store/programming/patientRegisterPagination';

export const useGetDate = (initialDate: Date, endDate: Date, setEvents: Function, roomTypeId?: string, roomId?: string) => {
  // const fetchEvents = useProgrammingRegisterStore((state) => state.fetchEvents);
  const [isLoading, setIsLoading] = useState(false);
  const eventsFetched = usePatientRegisterPaginationStore((state) => state.data);
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const formattedinitialDate = initialDate.toISOString();
        const formattedendDate = endDate.toISOString();
        const res = await getRoomsEventsByDate(formattedinitialDate,formattedendDate, roomTypeId, roomId);
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
          setEvents(res);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [initialDate, endDate, eventsFetched, roomTypeId, roomId]);
  return {
    isLoading,
  };
};
