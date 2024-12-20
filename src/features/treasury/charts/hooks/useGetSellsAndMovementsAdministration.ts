import { useQuery } from '@tanstack/react-query';
import { SellsAndMovementsAdministration } from '../types/types.charts';
import { ChartsService } from '../services/services.charts';

export const useGetSellsAndMovementsAdministration = () => {
  return useQuery<SellsAndMovementsAdministration>({
    queryKey: ['sells-and-movements-administration'],
    queryFn: ChartsService.getAdministrationSellsAndMovements,
  });
};
