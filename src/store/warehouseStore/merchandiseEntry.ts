import { createWithEqualityFn } from 'zustand/traditional';
import { getPetitionsListByWareHouseId } from '../../api/api.routes';
import { MerchandiseEntry } from '../../types/types';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { getFirstDayOfTheMonth } from '../../utils/functions/dataUtils';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: MerchandiseEntry[] | null;
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeSubWarehouse: boolean;
  searchUser: string;
  startDate: string;
  endDate: string;
  clearFilters: Function;
  setStartDate: Function;
  setEndDate: Function;
  setSearch: Function;
  sort: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeSubWarehouse: (handleChangeSubWarehouse: boolean) => void;
  fetchMerchandiseEntries: () => Promise<void>;
  clearData: () => void;
  setSearchUser: (searchUser: string) => void;
  setSort: (sort: string) => void;
}

export const merchandiseEntryPagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: null,
  isLoading: true,
  search: '',
  startDate: getFirstDayOfTheMonth(),
  endDate: '',
  enabled: true,
  handleChangeSubWarehouse: false,
  searchUser: '',
  sort: '',
  setSort: (sort: string) => set({ sort }),
  setEndDate: (endDate: string) => set({ endDate }),
  setStartDate: (startDate: string) => set({ startDate }),
  setSearchUser: (searchUser: string) => set({ searchUser }),
  setHandleChangeSubWarehouse: (handleChangeSubWarehouse: boolean) => set({ handleChangeSubWarehouse }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  clearFilters: () => set({ endDate: '', startDate: '' }),
  fetchMerchandiseEntries: async () => {
    const { pageIndex, enabled, pageSize, search, startDate, endDate, sort } = get();
    set(() => ({ isLoading: true }));

    const page = pageIndex + 1;
    try {
      const res = await getPetitionsListByWareHouseId(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_Almacen=${
          useWarehouseTabsNavStore.getState().warehouseData.id_Almacen
        }&FechaInicio=${startDate}&FechaFin=${endDate}&Sort=${sort}`
      );
      console.log('yagora?', res.data);
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
      pageSize: 10,
      search: '',
      isLoading: true,
    }));
  },
}));
