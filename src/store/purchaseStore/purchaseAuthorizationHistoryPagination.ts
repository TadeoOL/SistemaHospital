import { createWithEqualityFn } from 'zustand/traditional';
import { getPurchaseAuthorizationHistory } from '../../api/api.routes';
import { IPurchaseAuthorization } from '../../types/types';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IPurchaseAuthorization[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangePurchaseAuthorization: boolean;
  endDate: string;
  startDate: string;
  status: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangePurchaseAuthorization: (handleChangePurchaseAuthorization: boolean) => void;
  fetchPurchaseAuthorization: () => Promise<void>;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setStatus: (status: string) => void;
  clearFilters: () => void;
}

export const usePurchaseAuthorizationHistoryPagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangePurchaseAuthorization: false,
  status: '-1',
  endDate: '',
  startDate: '',
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setStatus: (status: string) => set({ status }),
  setHandleChangePurchaseAuthorization: (handleChangePurchaseAuthorization: boolean) =>
    set({ handleChangePurchaseAuthorization }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchPurchaseAuthorization: async () => {
    const { pageIndex, enabled, pageSize, search, startDate, endDate, status } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getPurchaseAuthorizationHistory(
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
  clearFilters: () => {
    set({ status: '-1', pageIndex: 0, startDate: '', endDate: '' });
  },
}));