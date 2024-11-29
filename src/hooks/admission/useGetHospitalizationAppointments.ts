import { useEffect, useState } from 'react';
import { IEventsCalendar } from '../../types/types';
import { IHospitalRoomReservation, ISurgeryRoomReservation } from '../../types/programming/hospitalSpacesTypes';
import { getHospitalRoomReservations, getSurgeryRoomsReservations } from '../../services/programming/hospitalSpace';
import dayjs from 'dayjs';

export const useGetHospitalizationAppointments = (
  date: Date,
  setEvents: Function,
  events: IEventsCalendar[],
  roomType: number | 'both',
  originalEvents: IEventsCalendar[],
  setOriginalEvents: Function
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const initialDate = dayjs(date).subtract(1.5, 'month').toISOString();
        const endDate = dayjs(date).add(1.5, 'month').toISOString();
        let res: (ISurgeryRoomReservation | IHospitalRoomReservation)[] = [];

        if (roomType === 1 || roomType === 'both') {
          const surgeryRes = await getSurgeryRoomsReservations({ endDate, initialDate });
          res = res.concat(surgeryRes);
        }

        if (roomType === 0 || roomType === 'both') {
          const roomRes = await getHospitalRoomReservations({ endDate, initialDate });
          res = res.concat(roomRes);
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
  }, [date, roomType]);

  return {
    isLoading,
  };
};
