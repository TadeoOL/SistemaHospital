import { useQuery } from '@tanstack/react-query';
import { getSaldoRevolvente } from '../services/cashflow';

export const useGetCashFlowFund = () => {
  return useQuery<any>({
    queryKey: ['cashflow-fund'],
    queryFn: () => getSaldoRevolvente(),
  });
};
