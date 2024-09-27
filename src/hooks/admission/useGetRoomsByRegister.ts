import { useQuery } from '@tanstack/react-query';
import { getRegisterRoomsByRegisterId } from '../../services/programming/admissionRegisterService';
import { IRoomEvent } from '../../types/types';

export const useGetRoomsByRegister = (registerId: string) => {
  const {
    data = [],
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['registeredRooms', registerId],
    queryFn: () => getRegisterRoomsByRegisterId(registerId),
  });

  return {
    isLoading,
    data: data as IRoomEvent[],
    isError,
    refetch,
  };
};
