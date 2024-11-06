import { useEffect, useState } from 'react';
import { IEventsCalendar } from '../../types/types';
import { IHospitalRoomReservation, ISurgeryRoomReservation } from '../../types/programming/hospitalSpacesTypes';
import { getHospitalRoomReservations, getSurgeryRoomsReservations } from '../../services/programming/hospitalSpace';

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
        let res: ISurgeryRoomReservation[] | IHospitalRoomReservation[];
        if(roomType === 1){
          res = await getSurgeryRoomsReservations({endDate:formattedDate});
        }else{
          res = await getHospitalRoomReservations(formattedDate);
        }
        if (res.length > 0) {
          const formattedRes = res.map((event) => {
            const isSurgeryRoom = 'id_Quirofano' in event;
            return {
              id: event.id_CuentaEspacioHospitalario,
              roomId: isSurgeryRoom ? event.id_Quirofano : event.id_Cuarto,
              title: isSurgeryRoom ? event.nombreQuirofano : event.nombreCuarto,
              start: new Date(event.horaInicio),
              end: new Date(event.horaFin),
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
