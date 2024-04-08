import { createWithEqualityFn } from 'zustand/traditional';
import { getProviders } from '../../api/api.routes';

interface State {
  pageSize: number;
  pageIndex: number;
  search: string;
  enabled: boolean;
  count: number;
  data: any[];
  pageCount: number;
  isLoading: boolean;
  handleChangeProvider: boolean;
}

interface Action {
  setPageSize: (pageSize: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  fetchProviders: (pageIndex: number, pageSize: number, search: string, enabled: boolean) => Promise<void>;
  setHandleChangeProvider: (handleChangeProvider: boolean) => void;
}

export const useProviderPagination = createWithEqualityFn<State & Action>((set) => ({
  count: 0,
  pageIndex: 0,
  pageSize: 10,
  enabled: true,
  search: '',
  data: [],
  pageCount: 0,
  isLoading: true,
  handleChangeProvider: false,
  setPageIndex: (state: number) => set(() => ({ pageIndex: state })),
  setPageSize: (state: number) => set(() => ({ pageSize: state, pageIndex: 0 })),
  setEnabled: (state: boolean) => set(() => ({ enabled: state })),
  setSearch: (state: string) => set(() => ({ search: state, pageIndex: 0 })),
  setHandleChangeProvider: (state: boolean) => set(() => ({ handleChangeProvider: state })),
  fetchProviders: async (pageIndex: number, pageSize: number, search: string, enabled: boolean) => {
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getProviders(
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
