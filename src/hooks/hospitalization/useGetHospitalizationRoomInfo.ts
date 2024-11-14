import { useQuery } from '@tanstack/react-query';
import { getHospitalRoomInformation } from '../../services/hospitalization/hospitalRoomsService';
import { IHospitalRoomInformation } from '../../types/hospitalization/hospitalRoomTypes';

export const useGetHospitalizationRoomInfo = (id: string) => {
  const { data = [], isError, isLoading } = useQuery({
    queryKey: ['hospitalizationRoomInfo', id],
    queryFn: async () => getHospitalRoomInformation(id),
  });

  return {
    isLoading,
    data: data as IHospitalRoomInformation,
    isError,
  };
};
