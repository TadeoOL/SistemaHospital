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
  handleChangeArticle: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeArticle: (handleChangeArticle: boolean) => void;
  fetchArticles: () => Promise<void>;
  cleanArticles: () => void;
}

export const useArticlePagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeArticle: false,
  setHandleChangeArticle: (handleChangeArticle: boolean) => set({ handleChangeArticle }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchArticles: async () => {
    const { pageIndex, pageSize, enabled, search } = get();
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
  cleanArticles: () => {
    set(() => ({ pageIndex: 0, pageSize: 5, enabled: true, search: '' }));
  },
}));
