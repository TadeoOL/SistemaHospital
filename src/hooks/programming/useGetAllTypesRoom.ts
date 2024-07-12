import { useQuery } from '@tanstack/react-query';
import { getAllTypesRoom } from '../../services/programming/typesRoomService';

export const useGetAllTypesRoom = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allRooms'],
    queryFn: async () => getAllTypesRoom(),
  });

  return {
    isLoadingTypeRoom: isLoading,
    data: data as { id: string; nombre: string }[],
    isError,
  };
};
