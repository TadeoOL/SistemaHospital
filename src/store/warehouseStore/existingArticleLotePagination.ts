import { createWithEqualityFn } from 'zustand/traditional';
import { getAmountForArticleInWarehouse } from '../../api/api.routes';
import { IExistingArticleList } from '../../types/types';
import { getFirstDayOfTheMonth } from '../../utils/functions/dataUtils';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IExistingArticleList[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeExistingArticle: boolean;
  warehouseId: string;
  articleId: string;
  startDate: string;
  endDate: string;
  sort: string;
}

interface Action {
  setCount: (count: number) => void;
  setData: () => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => void;
  fetchExistingArticles: (inhabilitados: boolean | null) => Promise<void>;
  setWarehouseId: (warehouseId: string) => void;
  setArticleId: (articleId: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  clearFilters: () => void;
  clearAllData: () => void;
  setSort: (sort: string) => void;
}

const initialState: State = {
  count: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: false,
  search: '',
  enabled: true,
  handleChangeExistingArticle: false,
  warehouseId: '',
  articleId: '',
  startDate: getFirstDayOfTheMonth(),
  endDate: '',
  sort: '',
};

export const useExistingArticleLotesPagination = createWithEqualityFn<State & Action>((set, get) => ({
  ...initialState,
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setArticleId: (articleId: string) => set({ articleId }),
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => set({ handleChangeExistingArticle }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSort: (sort: string) => set({ sort }),
  setData: () => set({ data: [] }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchExistingArticles: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    set(() => ({ isLoading: true }));
    const { warehouseId, articleId } = get();
    try {
      if (warehouseId === '') return;
      const res = await getAmountForArticleInWarehouse(articleId, warehouseId)
      /*const res = await getAmountForArticleInWarehouse(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_Almacen=${warehouseId}&Id_Articulo=${
          articleId
        }${inhabilitados === null ? '' : `&LoteHabilitado=${inhabilitados}`}`
      );*/
      set(() => ({
        data: res.data,
        count: res.count,
        pageSize: res.pageSize,
        enabled: res.habilitado,
        pageCount: res.pageCount,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  clearFilters: () => {
    set({
      pageCount: 0,
      pageIndex: 0,
      pageSize: 10,
      search: '',
      isLoading: true,
      startDate: '',
      endDate: '',
    });
  },
  clearAllData: () => {
    set(initialState);
  },
}));
