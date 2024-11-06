import { useQuery } from '@tanstack/react-query';
import { getAllHospitalRooms } from '../../services/programming/roomsService';
import { getAllOperatingRooms } from '../../services/operatingRoom/dailyOperatingRoomService';

export const useGetAllRooms = (tipoCuarto?: string) => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allRooms', tipoCuarto],
    queryFn: async () => {
      switch (tipoCuarto) {
        case '0':
          return getAllHospitalRooms();
        default:
          return getAllOperatingRooms(); 
      }
    },
  });

  return {
    isLoadingRooms: isLoading,
    data: data as any,
    isError,
  };
};
