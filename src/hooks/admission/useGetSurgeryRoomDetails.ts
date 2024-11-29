import { getSurgeryRoomDetails } from '@/services/admission/admisionService';
import { ISurgeryRoomDetails } from '@/types/programming/surgeryRoomTypes';
import { useQuery } from '@tanstack/react-query';

export const useGetSurgeryRoomDetails = (id: string) => {
  return useQuery<ISurgeryRoomDetails>({
    queryKey: ['surgeryRoomDetails', id],
    queryFn: () => getSurgeryRoomDetails(id),
  });
};
