import { usePosSellsHistoryDataStore } from '../../../store/pharmacy/pointOfSale/posSellsHistoryData';
import { ArticlesSoldHistoryTableComponent } from '../ArticlesSoldHistoryTableComponent';
import { useGetSellsHistory } from '../../../hooks/useGetSellsHistory';

export const ArticlesSoldHistory = () => {
  const count = usePosSellsHistoryDataStore((state) => state.count);
  const pageIndex = usePosSellsHistoryDataStore((state) => state.pageIndex);
  const pageSize = usePosSellsHistoryDataStore((state) => state.pageSize);
  const setPageIndex = usePosSellsHistoryDataStore((state) => state.setPageIndex);
  const setPageSize = usePosSellsHistoryDataStore((state) => state.setPageSize);
  const setSearch = usePosSellsHistoryDataStore((state) => state.setSearch);
  const clearData = usePosSellsHistoryDataStore((state) => state.clearData);
  const sellStates = [0, 2];
  const { isLoading, sellsHistory } = useGetSellsHistory(sellStates);

  return (
    <ArticlesSoldHistoryTableComponent
      clearData={clearData}
      count={count}
      data={sellsHistory}
      isLoading={isLoading}
      pageIndex={pageIndex}
      pageSize={pageSize}
      setPageIndex={setPageIndex}
      setPageSize={setPageSize}
      setSearch={setSearch}
    />
  );
};
