import { createWithEqualityFn } from 'zustand/traditional';
import { getPackagesNamesByWarehouseIdAndSearch } from '../../api/api.routes';
import { IArticlesPackageSearch } from '../../types/types';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { debouncedSetSearch, getFirstDayOfTheMonth } from '../../utils/functions/dataUtils';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IArticlesPackageSearch[] | null;
  isLoading: boolean;
  search: string;
  sort: string;
  enabled: boolean;
  searchUser: string;
  startDate: string;
  endDate: string;
  clearFilters: Function;
  setStartDate: Function;
  setEndDate: Function;
  setSearch: Function;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  fetchWarehousePackages: () => Promise<void>;
  clearData: () => void;
  setSort: (sort: string) => void;
  setSearchUser: (searchUser: string) => void;
}

export const usePackageNamesPaginationStore = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 20,
  data: null,
  isLoading: true,
  search: '',
  startDate: getFirstDayOfTheMonth(),
  endDate: '',
  enabled: true,
  searchUser: '',
  sort: '',
  setSort: (sort: string) => set({ sort }),
  setEndDate: (endDate: string) => set({ endDate }),
  setStartDate: (startDate: string) => set({ startDate }),
  setSearchUser: (searchUser: string) => set({ searchUser }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => {
    debouncedSetSearch(set, search);
  },
  setEnabled: (enabled: boolean) => set({ enabled }),
  clearFilters: () => set({ endDate: '', startDate: '' }),
  fetchWarehousePackages: async () => {
    const { pageIndex, enabled, pageSize, search, startDate, endDate, sort } = get();
    set(() => ({ isLoading: true }));

    const page = pageIndex + 1;
    try {
      const res = await getPackagesNamesByWarehouseIdAndSearch(
        `Id_Almacen=${useWarehouseTabsNavStore.getState().warehouseData.id}&${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&FechaInicio=${startDate}&FechaFin=${endDate}&Sort=${sort}`
      );
      set(() => ({
        data: res.data,
        count: res.count,
        pageSize: res.pageSize,
        enabled: res.habilitado,
      }));
    } catch (error) {
      console.log(error);
      set(() => ({ data: [] }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  clearData: () => {
    set(() => ({
      pageCount: 0,
      pageIndex: 0,
      pageSize: 20,
      search: '',
      data: null,
      isLoading: true,
    }));
  },
}));
