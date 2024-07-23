import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getHospitalRoomsCalendar } from '../../services/hospitalization/hospitalRoomsService';

export const useGetHospitalizationRoomsCalendar = (date: Date) => {
  const key = dayjs(date).format('YYYY-MM-DD');

  const { data, isError, isLoading } = useQuery({
    queryKey: ['hospitalizationRoomsCalendar', key],
    queryFn: async () => {
      return await getHospitalRoomsCalendar(date);
    },
    staleTime: 5 * (60 * 1000),
    refetchInterval: 5 * (60 * 1000),
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
