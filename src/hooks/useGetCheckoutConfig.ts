import { useQuery } from '@tanstack/react-query';
import { IConfigEmitterUsers } from '../types/types';
import { getCashVoucherConfig } from '../services/checkout/chashVoucherService';

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
