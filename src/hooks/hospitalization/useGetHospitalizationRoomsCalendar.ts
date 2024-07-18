import { useQuery } from '@tanstack/react-query';
import { getHospitalRoomsCalendar } from '../../services/hospitalization/hospitalRoomsService';

export const useGetHospitalizationRoomsCalendar = (date: Date) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['hospitalizationRoomsCalendar', date],
    queryFn: async () => getHospitalRoomsCalendar(date),
  });

  return {
    isLoading,
    data: data as CalendarRoomEvent[],
    isError,
  };
};

interface CalendarRoomEvent {
  id: string;
  id_Cuarto: string;
  nombre: string;
  inicio: string;
  fin: string;
}
