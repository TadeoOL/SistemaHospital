import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { type ICheckoutSell } from '../../types/types';
import { getSells } from '../../services/checkout/checkoutService';
import { useCheckoutDataStore } from './checkoutData';

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  loading: false,
  enabled: true,
  search: '',
  fetchPagination: false,
  cancelToken: null as CancelTokenSource | null,
  checkoutId: '',
  sort: '',
  startDate: '',
  endDate: '',
  status: 1,
};

interface Action {
  setData: (data: ICheckoutSell) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setStatus: (status: number) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  setFetchPagination: (fetchPagination: boolean) => void;
  setEndDate: (endDate: string) => void;
  setStartDate: (startDate: string) => void;
  clearFilters: () => void;
}

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: ICheckoutSell[];
  loading: boolean;
  search: string;
  enabled: boolean;
  fetchPagination: boolean;
  cancelToken: CancelTokenSource | null;
  checkoutId: string;
  sort: string;
  startDate: string;
  endDate: string;
  status: number;
}

export const useCheckoutPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setData: (updateData: ICheckoutSell) => {
    const { data, pageIndex, count } = get();
    if (data.length > 0 && data[0].id_VentaPrincipal === updateData.id_VentaPrincipal) return;
    if (pageIndex > 0) {
      set({ count: count + 1 });
      return;
    }
    if (data.length >= 10) {
      set({ data: [updateData, ...data.slice(0, 9)], count: count + 1 });
      return;
    }
    set({ data: [updateData, ...data] });
  },
  setPageSize: (pageSize: number) => set({ pageSize }),
  setStatus: (status: number) => set({ status }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setFetchPagination: (fetchPagination: boolean) => set({ fetchPagination }),

  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, fetchPagination, data, sort, startDate, endDate, status } = get();

    set({ loading: true });
    const index = pageIndex + 1;
    const checkoutId = useCheckoutDataStore.getState().id;

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getSells(
        `pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}&habilitado=${enabled}&Id_Caja=${checkoutId}&fechaInicio=${startDate}&fechaFin=${endDate}&sort=${sort}&estatus=${status}`
      );
      set({
        data: fetchPagination ? [...data, ...res.data] : res.data,
        pageSize: res.pageSize,
        count: res.count,
        pageCount: res.pageCount,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('cancelado', error);
      } else {
        console.log(error);
      }
    } finally {
      if (!cancelToken.token.reason) {
        set({ loading: false, fetchPagination: false });
      }
    }
  },
  clearFilters: () => {
    set({
      pageCount: 0,
      pageIndex: 0,
      pageSize: 10,
      search: '',
      loading: true,
      startDate: '',
      endDate: '',
      status: 1,
    });
  },
}));
