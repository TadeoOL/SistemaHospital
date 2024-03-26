import { createWithEqualityFn } from 'zustand/traditional';
import { getPurchaseOrder } from '../../api/api.routes';
import { IPurchaseOrder } from '../../types/types';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IPurchaseOrder[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChange: boolean;
  status: string;
  startDate: string;
  endDate: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChange: (handleChange: boolean) => void;
  fetch: () => Promise<void>;
  setStatus: (status: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  clearFilters: () => void;
}

export const usePurchaseOrderPagination = createWithEqualityFn<State & Action>()((set, get) => ({
  count: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChange: false,
  status: '-1',
  startDate: '',
  endDate: '',
  setEndDate: (endDate: string) => set({ endDate }),
  setStartDate: (startDate: string) => set({ startDate }),
  setStatus: (status: string) => set({ status, pageIndex: 0 }),
  setHandleChange: (handleChange: boolean) => set({ handleChange }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  clearFilters: () => set({ endDate: '', startDate: '', status: '-1' }),
  fetch: async () => {
    set(() => ({ isLoading: true }));
    const { pageIndex, pageSize, search, enabled, status, startDate, endDate } = get();
    const page = pageIndex + 1;
    try {
      const res = await getPurchaseOrder(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&estatus=${
          parseInt(status) > -1 ? status : ''
        }&fechaInicio=${startDate}&fechaFin=${endDate}`
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
