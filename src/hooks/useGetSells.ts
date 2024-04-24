import { useEffect } from 'react';
import { usePosSellsDataStore } from '../store/pharmacy/pointOfSale/posSellsData';

export const useGetSells = (sellStates: number[]) => {
  const isLoading = usePosSellsDataStore((state) => state.isLoading);
  const setSellStates = usePosSellsDataStore((state) => state.setSellStates);
  const fetchSells = usePosSellsDataStore((state) => state.fetchSells);
  const sells = usePosSellsDataStore((state) => state.sells);

  useEffect(() => {
    setSellStates(sellStates);
    fetchSells();
  }, []);

  return { sells, isLoading };
};
