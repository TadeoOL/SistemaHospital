import { useQuery } from '@tanstack/react-query';
import { getAllRooms } from '../../services/programming/roomsService';
import { IRoomsList } from '../../types/types';

export const useGetAllRooms = (tipoCuarto?: string) => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allRooms', tipoCuarto],
    queryFn: async () => getAllRooms(tipoCuarto),
  });

  return {
    isLoadingRooms: isLoading,
    data: data as IRoomsList[],
    isError,
  };
};
