import { ISell } from '../../../types/types';
import { usePosOrderArticlesStore } from './posOrderArticles';
import { getSellsHistory } from '../../../services/pharmacy/pointOfSaleService';
import { create } from 'zustand';
import axios, { CancelTokenSource } from 'axios';

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 25,
  sellsHistory: [],
  enabled: true,
  search: '',
  isLoading: true,
  cancelToken: null as CancelTokenSource | null,
};

interface State {
  sellsHistory: ISell[];
  sellStates: number[];
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
}

interface Action {
  setSells: (sellsHistory: ISell[]) => void;
  fetchSellsHistory: () => Promise<void>;
  setSellStates: (sellStates: number[]) => void;
  setSearch: (search: string) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setPageCount: (pageCount: number) => void;
  clearData: () => void;
}

export const usePosSellsHistoryDataStore = create<State & Action>()((set, get) => ({
  ...initialValues,
  sellStates: [],
  setSells: (sellsHistory: ISell[]) => set({ sellsHistory }),
  setSellStates: (sellStates: number[]) => set({ sellStates }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  fetchSellsHistory: async () => {
    set({ isLoading: true });
    const { enabled, pageIndex, pageSize, sellStates, search } = get();
    const checkoutId = usePosOrderArticlesStore.getState().userSalesRegisterData.id;
    const estadosVenta = sellStates.join('&estadosVenta=');
    const cancelToken = axios.CancelToken.source();
    const index = pageIndex + 1;
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });
    try {
      const res = await getSellsHistory(
        `estadosVenta=${estadosVenta}&pageIndex=${index}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&id_Caja=${checkoutId}`,
        cancelToken.token
      );
      set({
        sellsHistory: res.data as ISell[],
        pageSize: res.pageSize,
        count: res.count,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        null;
      } else {
        console.log('Error:', error);
      }
    } finally {
      if (!cancelToken.token.reason || cancelToken.token.reason.message !== 'Componente desmontado') {
        set({ isLoading: false });
      }
    }
  },
  clearData: () => {
    const { cancelToken } = get();
    if (cancelToken) {
      cancelToken.cancel('Componente desmontado');
    }
    set(initialValues);
  },
}));
