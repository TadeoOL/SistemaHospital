import { useQuery } from '@tanstack/react-query';
import { IXRay } from '../../types/hospitalizationTypes';
import { getAllXRay } from '../../services/hospitalization/xrayService';

export const useGetAllXRay = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allXRay'],
    queryFn: async () => getAllXRay(),
  });

  return {
    isLoadingXRay: isLoading,
    xrayData: data as IXRay[],
    isError,
  };
};
