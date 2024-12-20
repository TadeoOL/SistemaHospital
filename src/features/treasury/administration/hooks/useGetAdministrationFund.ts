import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AdministrationService } from '../services/services.administration';
import { IAdministrationFund } from '../types/types.administration';

const MINUTE = 60 * 1000;
export const useGetAdministrationFund = () => {
  return useQuery<IAdministrationFund>({
    queryKey: ['administration-fund'],
    queryFn: AdministrationService.getAdministrationFund,
    staleTime: MINUTE * 5,
    gcTime: MINUTE * 10,
    placeholderData: keepPreviousData,
  });
};
