import { createWithEqualityFn } from 'zustand/traditional';
import { getWareHouseMovementsById } from '../../api/api.routes';
import { IWarehouseMovementData } from '../../types/types';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IWarehouseMovementData[] | null;
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeSubWarehouse: boolean;
  searchUser: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeSubWarehouse: (handleChangeSubWarehouse: boolean) => void;
  fetchWarehouseMovements: () => Promise<void>;
  clearData: () => void;
  setSearchUser: (searchUser: string) => void;
}

export const useWarehouseMovementPaginationStore = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: null,
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeSubWarehouse: false,
  searchUser: '',
  setSearchUser: (searchUser: string) => set({ searchUser }),
  setHandleChangeSubWarehouse: (handleChangeSubWarehouse: boolean) => set({ handleChangeSubWarehouse }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchWarehouseMovements: async () => {
    const { pageIndex, enabled, pageSize, search } = get();
    set(() => ({ isLoading: true }));

    const page = pageIndex + 1;
    try {
      const res = await getWareHouseMovementsById(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_AlmacenOrigen=${
          useWarehouseTabsNavStore.getState().warehouseData.id
        }`
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
      pageSize: 5,
      search: '',
      data: null,
      isLoading: true,
    }));
  },
}));
