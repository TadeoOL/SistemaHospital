import { useQuery } from '@tanstack/react-query';
import { getDiscountConfig } from '../../services/checkout/configCheckout';

const MINUTE = 1000 * 60;
export const useGetDiscountConfig = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['discountConfig'],
    queryFn: () => getDiscountConfig(),
    staleTime: MINUTE * 5,
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
