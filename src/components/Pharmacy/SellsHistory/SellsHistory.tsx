import { useEffect } from 'react';
import { useSellsHistoryPaginationStore } from '../../../store/pharmacy/sellsHistory/sellsHistoryPagination';
import { ArticlesSoldHistoryTableComponent } from '../ArticlesSoldHistoryTableComponent';

const headersChildren = ['Nombre', 'Cantidad', 'Precio Unitario'];
const headers = ['', 'Venta Total', 'Monto Total', 'Estado Venta', 'Tipo Pago', 'Folio', 'Artículos Vendidos'];
export const SellsHistory = () => {
  const setSearch = useSellsHistoryPaginationStore((state) => state.setSearch);
  const search = useSellsHistoryPaginationStore((state) => state.search);
  const clearData = useSellsHistoryPaginationStore((state) => state.clearData);
  const data = useSellsHistoryPaginationStore((state) => state.data);
  const count = useSellsHistoryPaginationStore((state) => state.count);
  const pageSize = useSellsHistoryPaginationStore((state) => state.pageSize);
  const pageIndex = useSellsHistoryPaginationStore((state) => state.pageIndex);
  const setPageIndex = useSellsHistoryPaginationStore((state) => state.setPageIndex);
  const setPageSize = useSellsHistoryPaginationStore((state) => state.setPageSize);
  const isLoading = useSellsHistoryPaginationStore((state) => state.loading);
  const fetch = useSellsHistoryPaginationStore((state) => state.fetchData);

  useEffect(() => {
    fetch();
  }, [search, pageSize, pageIndex]);

  return (
    <ArticlesSoldHistoryTableComponent
      clearData={clearData}
      count={count}
      data={data}
      isLoading={isLoading}
      pageIndex={pageIndex}
      pageSize={pageSize}
      setPageIndex={setPageIndex}
      setPageSize={setPageSize}
      setSearch={setSearch}
      hasReport={true}
      headersChildren={headersChildren}
      headers={headers}
    />
  );
};
