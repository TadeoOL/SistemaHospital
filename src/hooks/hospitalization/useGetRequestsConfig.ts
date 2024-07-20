import { useQuery } from '@tanstack/react-query';
import { getRequestsConfig } from '../../services/hospitalization/requestsConfigService';

export const useGetRequestsConfig = () => {
  const {
    data = [],
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['requestsConfig'],
    queryFn: async () => await getRequestsConfig(),
  });
  return {
    isLoadingRequestsConfig: isLoading,
    config: data,
    isError,
    refetch,
  };
};
