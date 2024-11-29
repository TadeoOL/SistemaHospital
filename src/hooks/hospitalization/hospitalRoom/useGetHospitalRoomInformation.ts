import { useQuery } from '@tanstack/react-query';
import { getHospitalRoomInformation } from '../../../services/programming/hospitalSpace';

const minute = 60 * 1000;
export const useGetHospitalRoomInformation = (hospitalSpaceAccountId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['hospital-room-information', hospitalSpaceAccountId],
    queryFn: () => getHospitalRoomInformation(hospitalSpaceAccountId),
    staleTime: 5 * minute,
    gcTime: 10 * minute,
  });
  return { data, isLoading };
};
