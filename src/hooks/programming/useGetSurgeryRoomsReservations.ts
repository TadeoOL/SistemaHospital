import { useQuery } from '@tanstack/react-query';
import { getSurgeryRoomsReservations } from '../../services/programming/hospitalSpace';

export const useGetSurgeryRoomsReservations = () => {
  const { data =[], isLoading } = useQuery({ queryKey: ['surgery-rooms-reservations'], queryFn: getSurgeryRoomsReservations });
  return { data, isLoading };
};
