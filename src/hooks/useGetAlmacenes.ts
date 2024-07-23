import { getAllAlmacenes } from '../api/api.routes';
import { IWarehouse } from '../types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetAlmacenes = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['almacen'],
    queryFn: async () => getAllAlmacenes(),
  });

  return {
    isLoadingAlmacenes: isLoading,
    almacenes: data as IWarehouse[],
    isError,
  };
};
