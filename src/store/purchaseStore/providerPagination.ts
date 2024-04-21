import { createWithEqualityFn } from 'zustand/traditional';
import { getProviders } from '../../api/api.routes';

interface State {
  pageSize: number;
  pageIndex: number;
  search: string;
  sort: string;
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
  setSort: (sort: string) => void;
  setEnabled: (enabled: boolean) => void;
  fetchProviders: () => Promise<void>;
  setHandleChangeProvider: (handleChangeProvider: boolean) => void;
}

export const useProviderPagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageIndex: 0,
  pageSize: 10,
  enabled: true,
  search: '',
  data: [],
  pageCount: 0,
  sort: '',
  isLoading: true,
  handleChangeProvider: false,
  setPageIndex: (state: number) => set(() => ({ pageIndex: state })),
  setPageSize: (state: number) => set(() => ({ pageSize: state, pageIndex: 0 })),
  setEnabled: (state: boolean) => set(() => ({ enabled: state })),
  setSearch: (state: string) => set(() => ({ search: state, pageIndex: 0 })),
  setSort: (sort: string) => set({ sort }),
  setHandleChangeProvider: (state: boolean) => set(() => ({ handleChangeProvider: state })),
  fetchProviders: async () => {
    const { pageIndex, pageSize, search, sort, enabled } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getProviders(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Sort=${sort}`
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
