import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { IServiceRequest } from '../../types/hospitalizationTypes';
import { getServicesRequestPagination } from '../../services/hospitalServices/hospitalServicesService';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IServiceRequest[];
  loading: boolean;
  status: number | null;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: (flag: boolean) => void;
  setEnabled: (enabled: boolean) => void;
  setStatus: (status: number | null) => void;
  clearData: () => void;
}

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  status: 1,
  pageSize: 10,
  data: [],
  loading: false,
  enabled: true,
  search: '',
  cancelToken: null as CancelTokenSource | null,
};

export const useXRayRequestPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setStatus: (status: number | null) => set({ status }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  fetchData: async (flag: boolean) => {
    const { enabled, search, pageIndex, pageSize, status } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getServicesRequestPagination(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&UsuarioEnfermero=${flag}&search=${search}&habilitado=${enabled}&${!status && status !== 0 ? '' : 'Estatus=' + status}`
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
  clearData: () => {
    set({ ...initialValues });
  },
}));
