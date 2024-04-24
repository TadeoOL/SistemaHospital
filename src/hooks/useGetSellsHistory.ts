import { useEffect } from 'react';
import { usePosSellsHistoryDataStore } from '../store/pharmacy/pointOfSale/posSellsHistoryData';

export const useGetSellsHistory = (sellsStates: number[]) => {
  const fetchSellsHistory = usePosSellsHistoryDataStore((state) => state.fetchSellsHistory);
  const sellsHistory = usePosSellsHistoryDataStore((state) => state.sellsHistory);
  const isLoading = usePosSellsHistoryDataStore((state) => state.isLoading);
  const pageIndex = usePosSellsHistoryDataStore((state) => state.pageIndex);
  const pageCount = usePosSellsHistoryDataStore((state) => state.pageCount);
  const pageSize = usePosSellsHistoryDataStore((state) => state.pageSize);
  const search = usePosSellsHistoryDataStore((state) => state.search);
  const setSearch = usePosSellsHistoryDataStore((state) => state.setSearch);
  const setPageIndex = usePosSellsHistoryDataStore((state) => state.setPageIndex);
  const setPageSize = usePosSellsHistoryDataStore((state) => state.setPageSize);
  const setSellStates = usePosSellsHistoryDataStore((state) => state.setSellStates);

  useEffect(() => {
    setSellStates(sellsStates);
    fetchSellsHistory();
  }, [search, pageSize, pageIndex]);

  return {
    sellsHistory,
    isLoading,
    pageSize,
    pageIndex,
    pageCount,
    setPageSize,
    setPageIndex,
    setSearch,
  };
};
