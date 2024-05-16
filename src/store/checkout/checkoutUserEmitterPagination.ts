import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { type ICheckoutSell } from '../../types/types';
import { getUserEmitterSells } from '../../services/checkout/checkoutService';
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
  cancelToken: null as CancelTokenSource | null,
};

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  setUpdateData: (dataUpdated: ICheckoutSell) => void;
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
  cancelToken: CancelTokenSource | null;
}

export const useCheckoutUserEmitterPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setUpdateData: (dataUpdated: ICheckoutSell) => {
    const { data } = get();
    const copyData = data;
    const index = data.findIndex((item) => item.id_VentaPrincipal === dataUpdated.id_VentaPrincipal);
    if (index !== -1) {
      copyData[index] = dataUpdated;
      set({ data: [...copyData] });
    }
  },
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize } = get();

    set({ loading: true });
    const index = pageIndex + 1;
    const checkoutId = useCheckoutDataStore.getState().idCajaSearch;
    
    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getUserEmitterSells(
        `pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}&habilitado=${enabled}&Id_Caja=${checkoutId}`
      );
      set({
        data: res.data,
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
        set({ loading: false });
      }
    }
  },
}));
