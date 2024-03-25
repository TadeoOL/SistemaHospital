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
}

export const useExistingArticlePagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeExistingArticle: false,
  warehouseId: '',
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => set({ handleChangeExistingArticle }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchExistingArticles: async () => {
    set(() => ({ isLoading: true }));
    const { pageIndex, pageSize, search, enabled, warehouseId } = get();
    const page = pageIndex + 1;
    try {
      const res = await getExistingArticles(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_Almacen=${warehouseId}`
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
}));
