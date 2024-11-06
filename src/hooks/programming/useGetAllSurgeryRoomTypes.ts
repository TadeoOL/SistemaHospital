import { getAllSurgeryRoomTypes } from '../../services/programming/suergeryRoomTypes';
import { useQuery } from '@tanstack/react-query';

export const useGetAllSurgeryRoomTypes = () => {
  const { data=[], isLoading } = useQuery({
    queryKey: ['surgeryRoomTypes'],
    queryFn: getAllSurgeryRoomTypes,
  });
  return { isLoadingSurgeryRoomType: isLoading, data: data };
};
