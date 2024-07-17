import { useQuery } from '@tanstack/react-query';
import { IDailyOperatingRoom } from '../../types/operatingRoomTypes';
import { getOperatingRoomInfo } from '../../services/operatingRoom/dailyOperatingRoomService';

export const useGetOperatingRoomInfo = (id: string) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['operatingRoomInfo', id],
    queryFn: async () => getOperatingRoomInfo(id),
  });

  return {
    isLoading,
    data: data as IDailyOperatingRoom,
    isError,
  };
};
