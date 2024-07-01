import { useQuery } from '@tanstack/react-query';
import { getNursesUsers } from '../../api/api.routes';

export const useGetAllNursesUsers = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allNursesUsers'],
    queryFn: async () => getNursesUsers(),
  });

  return {
    isLoadingNursesUsers: isLoading,
    nursesUsersData: data as { id: string; nombre: string }[],
    isError,
  };
};
