import { createWithEqualityFn } from 'zustand/traditional';
import { getArticles } from '../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeArticleProvider: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeArticleProvider: (handleChangeArticleProvider: boolean) => void;
  fetchArticlesProvider: (pageIndex: number, pageSize: number, search: string, enabled: boolean) => Promise<void>;
}

export const useArticleProviderPagination = createWithEqualityFn<State & Action>((set) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeArticleProvider: false,
  setHandleChangeArticleProvider: (handleChangeArticleProvider: boolean) => set({ handleChangeArticleProvider }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchArticlesProvider: async (pageIndex: number, pageSize: number, search: string, enabled: boolean) => {
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getArticles(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}`
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
