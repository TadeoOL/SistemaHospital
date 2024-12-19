import { useQuery } from '@tanstack/react-query';
import { getAdministrationSellsAndMovements } from '../services/services.administration';
import { SellsAndMovementsAdministration } from '../types/types.administration';

export const useGetSellsAndMovements = () => {
  return useQuery<SellsAndMovementsAdministration>({
    queryKey: ['sells-and-movements'],
    queryFn: getAdministrationSellsAndMovements,
  });
};
