import { useQuery } from '@tanstack/react-query';
import { IRoomInformation } from '../../types/operatingRoomTypes';
import { getHospitalizationRoomInfo } from '../../services/hospitalization/hospitalRoomsService';

export const useGetHospitalizationRoomInfo = (id: string) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['hospitalizationRoomInfo', id],
    queryFn: async () => getHospitalizationRoomInfo(id),
  });

  return {
    isLoading,
    data: data as IRoomInformation,
    isError,
  };
};
