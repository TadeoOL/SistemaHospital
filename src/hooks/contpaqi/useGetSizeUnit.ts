import { useQuery } from '@tanstack/react-query';
import { getSizeUnit } from '../../services/contpaqi/sizeUnit';
import { SizeUnit } from '../../types/contpaqiTypes';

export const useGetSizeUnit = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['sizeUnit'],
    queryFn: async () => getSizeUnit(),
  });

  return {
    isLoadingConcepts: isLoading,
    sizeUnit: data as SizeUnit[],
    isError,
  };
};
