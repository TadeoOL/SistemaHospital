import { getPharmacyConfig } from '../services/pharmacy/configService';
import { IPharmacyConfig } from '../types/types';
import { useQuery } from '@tanstack/react-query';

const minute = 60 * 1000;
export const useGetPharmacyConfig = () => {
  const {
    data = [],
    isError,
    isLoading = true,
  } = useQuery({
    queryKey: ['PharmacyConfig'],
    queryFn: async () => getPharmacyConfig(),
    staleTime: 10 * minute,
    gcTime: 20 * minute,
  });

  return {
    isLoading: isLoading,
    data: data as IPharmacyConfig,
    isError,
  };
};
