import { createWithEqualityFn } from 'zustand/traditional';
import { getExistingArticles } from '../../api/api.routes';
import { IExistingArticle } from '../../types/types';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IExistingArticle[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeExistingArticle: boolean;
  warehouseId: string;
  startDate: string;
  endDate: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => void;
  fetchExistingArticles: () => Promise<void>;
  setWarehouseId: (warehouseId: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  clearFilters: () => void;
}

export const useExistingArticlePagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeExistingArticle: false,
  warehouseId: '',
  startDate: '',
  endDate: '',
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => set({ handleChangeExistingArticle }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchExistingArticles: async () => {
    set(() => ({ isLoading: true }));
    const { pageIndex, pageSize, search, enabled, warehouseId, startDate, endDate } = get();
    const page = pageIndex + 1;
    try {
      const res = await getExistingArticles(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_Almacen=${warehouseId}&fechaInicio=${startDate}&fechaFin=${endDate}`
      );
      set(() => ({
        data: res.data,
        count: res.count,
        pageSize: res.pageSize,
        enabled: res.habilitado,
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
}));
