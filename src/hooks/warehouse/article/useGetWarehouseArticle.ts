import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getExistingArticles } from '../../../services/warehouse/articleWarehouseService';

const MINUTES = 1000 * 60;
export const useGetWarehouseArticle = (paramUrl: string) => {
  const { 
    data, 
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['articles', paramUrl],
    queryFn: () => getExistingArticles(paramUrl),
    staleTime: MINUTES,
    gcTime: MINUTES * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
  return { data: data?.data, isLoading, isPlaceholderData };
};
