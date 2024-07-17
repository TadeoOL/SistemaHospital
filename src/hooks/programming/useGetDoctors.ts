import { useQuery } from '@tanstack/react-query';
import { getAllMedics } from '../../services/hospitalization/medicService';

export const useGetMedics = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allMedics'],
    queryFn: async () => getAllMedics(),
  });

  return {
    isLoadingMedics: isLoading,
    doctorsData: data as { id: string; nombre: string }[],
    isError,
  };
};
