import { createWithEqualityFn } from 'zustand/traditional';
import { getFirstDayOfTheMonth, wasAuth } from '../../utils/functions/dataUtils';
import { getPurchaseOrder } from '@/services/purchase/purchaseService';
import { IPurchaseOrderPagination } from '@/types/purchase/purchaseTypes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IPurchaseOrderPagination[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChange: boolean;
  status: string;
  startDate: string;
  endDate: string;
  sort: string;
  requiredAuth: number;
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
  setSort: (sort: string) => void;
  setRequiredAuth: (requiredAuth: number) => void;
}

export const usePurchaseOrderPagination = createWithEqualityFn<State & Action>()((set, get) => ({
  count: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChange: false,
  status: '-1',
  startDate: getFirstDayOfTheMonth(),
  endDate: '',
  sort: '',
  requiredAuth: 0,
  setRequiredAuth: (requiredAuth: number) => set({ requiredAuth }),
  setEndDate: (endDate: string) => set({ endDate }),
  setStartDate: (startDate: string) => set({ startDate }),
  setStatus: (status: string) => set({ status, pageIndex: 0 }),
  setHandleChange: (handleChange: boolean) => set({ handleChange }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setSort: (sort: string) => set({ sort }),
  clearFilters: () => set({ endDate: '', startDate: '', status: '-1', requiredAuth: 0 }),
  fetch: async () => {
    set(() => ({ isLoading: true }));
    const { pageIndex, pageSize, search, enabled, status, startDate, endDate, sort, requiredAuth } = get();
    try {
      const res = await getPurchaseOrder({
        estatus: status === '-1' ? undefined : parseInt(status),
        fueAutorizada: wasAuth(requiredAuth),
        pageIndex: pageIndex + 1,
        pageSize,
        search,
        habilitado: enabled,
        fechaInicio: startDate,
        fechaFin: endDate,
        sort,
      });
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
