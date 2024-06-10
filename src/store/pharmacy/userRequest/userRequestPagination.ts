import { ICheckoutHistory } from '../../../types/types';
import { getCheckoutHistory } from '../../../services/pharmacy/pointOfSaleService';
import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: ICheckoutHistory[];
  loading: boolean;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  startDate: string;
  endDate: string;
  sellValue: number[];
  minValue: number;
  maxValue: number;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  clearData: () => void;
  setSellValue: (value: number[]) => void;
}

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
  cancelToken: null as CancelTokenSource | null,
  startDate: '',
  endDate: '',
  sellValue: [0, 100000],
  minValue: 0,
  maxValue: 1,
};

export const useUserRequestPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setStartDate: (startDate: string) => set({ startDate, pageIndex: 0 }),
  setEndDate: (endDate: string) => set({ endDate, pageIndex: 0 }),
  setSellValue: (sellValue: number[]) => set({ sellValue, pageIndex: 0 }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getCheckoutHistory(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}&habilitado=${enabled}&`
      );

      set({
        data: res.data,
        pageSize: res.pageSize,
        count: res.count,
        pageCount: res.pageCount,
        minValue: res.valorMinimo,
        maxValue: res.valorMaximo,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('cancelado', error);
      } else {
        console.log(error);
      }
    } finally {
      if (!cancelToken.token.reason) {
        set({ loading: false });
      }
    }
  },
  clearData: () => {
    set({ ...initialValues });
  },
}));
