import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { type ICheckoutSell } from '../../types/types';
import { useCheckoutDataStore } from './checkoutData';
import { getCashVoucherPagination } from '../../services/checkout/chashVoucherService';

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
  sort: '',
  cancelToken: null as CancelTokenSource | null,
  startDate: '',
  endDate: '',
  status: 1,
  conceptoVenta: null,
};

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  fetchData: (module?: string) => void;
  setEnabled: (enabled: boolean) => void;
  setUpdateData: (dataUpdated: ICheckoutSell) => void;
  setEndDate: (endDate: string) => void;
  setStartDate: (startDate: string) => void;
  clearFilters: () => void;
  setConceptoVenta: (pageSize: number) => void;
  setStatus: (status: number) => void;
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
  sort: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  startDate: string;
  endDate: string;
  status: number;
  conceptoVenta: number | null;
}

export const useCheckoutUserEmitterPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  setStatus: (status: number) => set({ status }),
  setConceptoVenta: (conceptoVenta: number) => set({ conceptoVenta }),
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
    const { enabled, conceptoVenta, search, pageIndex, pageSize, sort, startDate, endDate, status } = get();

    set({ loading: true });
    const index = pageIndex + 1;
    const checkoutId = useCheckoutDataStore.getState().idCajaSearch;

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getCashVoucherPagination(
        `pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}${
          conceptoVenta === null ? '' : '&conceptoVenta=' + conceptoVenta
        }&search=${search}&habilitado=${enabled}${checkoutId ? `&Id_Caja=${checkoutId}` : ''}&fechaInicio=${startDate}&fechaFin=${endDate}&Sort=${sort}${status === 404 ? '' : `&estatus=${status}`}`
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
