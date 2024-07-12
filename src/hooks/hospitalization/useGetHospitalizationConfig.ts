import { useQuery } from '@tanstack/react-query';
import { IPurchaseInternConfig } from '../../types/types';
import { getHospitalizationConfig } from '../../api/api.routes';

export const useGetHospitalizationConfig = () => {
  const {
    data = [],
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['hospitalizationConfig'],
    queryFn: async () => await getHospitalizationConfig(),
  });
  return {
    isLoadingHospitalizationConfig: isLoading,
    config: data as IPurchaseInternConfig,
    isError,
    refetch,
  };
};
