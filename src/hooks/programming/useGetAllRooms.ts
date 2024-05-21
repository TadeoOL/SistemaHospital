import { useQuery } from '@tanstack/react-query';
import { getAllRooms } from '../../services/programming/roomsService';
import { IRoomsList } from '../../types/types';

export const useGetAllRooms = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allRooms'],
    queryFn: async () => getAllRooms(),
  });

  return {
    isLoadingRooms: isLoading,
    data: data as IRoomsList[],
    isError,
  };
};
