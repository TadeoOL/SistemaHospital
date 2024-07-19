import { useQuery } from '@tanstack/react-query';
import { IRoomInformation } from '../../types/operatingRoomTypes';
import { getOperatingRoomInfo } from '../../services/operatingRoom/dailyOperatingRoomService';

export const useGetOperatingRoomInfo = (id: string) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['operatingRoomInfo', id],
    queryFn: async () => getOperatingRoomInfo(id),
  });

  return {
    isLoading,
    data: data as IRoomInformation,
    isError,
  };
};
