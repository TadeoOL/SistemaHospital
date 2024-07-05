import { useQuery } from '@tanstack/react-query';
import { getAllOperatingRooms } from '../../services/operatingRoom/dailyOperatingRoomService';

export const useGetAllOperatingRooms = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allOperatingRooms'],
    queryFn: async () => getAllOperatingRooms(),
  });

  return {
    isLoading,
    data: data as { id: string; nombre: string }[],
    isError,
  };
};
