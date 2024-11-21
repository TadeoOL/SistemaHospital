import { useQuery } from '@tanstack/react-query';
import { getCashVoucherConfig } from '../services/checkout/chashVoucherService';
import { IConfigEmitterUsers } from '../types/checkout/checkoutConfigTypes';

export const useGetCheckoutConfig = (action?: boolean) => {
  const {
    data = [],
    isError,
    isLoading = true,
  } = useQuery({
    queryKey: ['GetCheckoutConfig', action],
    queryFn: async () => await getCashVoucherConfig(),
  });

  return {
    loadingConfig: isLoading,
    config: data as IConfigEmitterUsers[],
    isError,
  };
};
