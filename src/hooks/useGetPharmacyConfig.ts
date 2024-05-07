import { getPharmacyConfig } from '../services/pharmacy/configService';
import { IPharmacyConfig } from '../types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetPharmacyConfig = () => {
  const {
    data = [],
    isError,
    isLoading = true,
  } = useQuery({
    queryKey: ['PharmacyConfig'],
    queryFn: async () => getPharmacyConfig(),
  });

  return {
    isLoading: isLoading,
    data: data as IPharmacyConfig,
    isError,
  };
};
