import { useQuery } from '@tanstack/react-query';
import { getAllAnesthesiologists } from '../../services/hospitalization/anesthesiologistService';

export const useGetAnesthesiologists = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allAnesthesiologists'],
    queryFn: async () => getAllAnesthesiologists(),
  });

  return {
    isLoadingAnesthesiologists: isLoading,
    anesthesiologistsData: data as { id: string; nombre: string }[],
    isError,
  };
};
