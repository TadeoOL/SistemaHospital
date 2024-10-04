import { createWithEqualityFn } from 'zustand/traditional';
import { getPurchaseWarehouse } from '../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeWarehouse: boolean;
  sort: string;
  /*startDate: string;
  endDate: string;
  clearFilters: Function;
  setStartDate: Function;
  setEndDate: Function;
  setSearch: Function;*/
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeWarehouse: (handleChangeWarehouse: boolean) => void;
  fetchExistingArticles: () => Promise<void>;
}

export const useWarehousePagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  sort: '',
  //startDate: '',
  //endDate: '',
  enabled: true,
  handleChangeWarehouse: false,
  //setEndDate: (endDate: string) => set({ endDate }),
  //setStartDate: (startDate: string) => set({ startDate }),
  setHandleChangeWarehouse: (handleChangeWarehouse: boolean) => set({ handleChangeWarehouse }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSort: (sort: string) => set({ sort }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  //  clearFilters: () => set({ endDate: '', startDate: '' }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchExistingArticles: async () => {
    const { pageIndex, pageSize, search, sort, enabled } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getPurchaseWarehouse(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Sort=${sort}`
      );
      set(() => ({
        data: res.data.map((p: any) => {
          return {
            id: p.id_Almacen,
            nombre: p.nombre,
            descripcion: p.descripcion,
          };
        }),
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
