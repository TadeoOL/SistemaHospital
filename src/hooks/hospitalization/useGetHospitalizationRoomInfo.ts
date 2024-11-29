import { useQuery } from '@tanstack/react-query';
import { IHospitalRoomInformation } from '../../types/hospitalization/hospitalRoomTypes';
import { getHospitalRoomInformation } from '../../services/programming/hospitalSpace';

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
