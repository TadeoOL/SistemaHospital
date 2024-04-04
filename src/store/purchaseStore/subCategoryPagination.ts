import { createWithEqualityFn } from 'zustand/traditional';
import { getSubCategories } from '../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeSubCategory: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeSubCategory: (handleChangeSubCategory: boolean) => void;
  fetchCategories: (pageIndex: number, pageSize: number, search: string, enabled: boolean) => Promise<void>;
}

export const useSubCategoryPagination = createWithEqualityFn<State & Action>((set) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeSubCategory: false,
  setHandleChangeSubCategory: (handleChangeSubCategory: boolean) => set({ handleChangeSubCategory }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchCategories: async (pageIndex: number, pageSize: number, search: string, enabled: boolean) => {
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getSubCategories(
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
