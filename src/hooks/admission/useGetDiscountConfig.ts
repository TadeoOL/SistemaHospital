import { useQuery } from '@tanstack/react-query';
import { getDiscountConfig } from '../../services/admission/discountConfigService';

export const useGetDiscountConfig = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['discountConfig'],
    queryFn: () => getDiscountConfig(),
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    data: data.map((x) => {
      return {
        id: x.id,
        name: x.nombre,
      };
    }),
    isError,
  };
};
