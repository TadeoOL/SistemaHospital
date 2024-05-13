import { useQuery } from '@tanstack/react-query';
import { getCheckoutConfig } from '../services/checkout/checkoutService';
import { IConfigEmitterUsers } from '../types/types';

export const useGetCheckoutConfig = (action?: boolean) => {
  const {
    data = [],
    isError,
    isLoading = true,
  } = useQuery({
    queryKey: ['GetCheckoutConfig', action],
    queryFn: async () => await getCheckoutConfig(),
  });

  return {
    loadingConfig: isLoading,
    config: data as IConfigEmitterUsers[],
    isError,
  };
};
