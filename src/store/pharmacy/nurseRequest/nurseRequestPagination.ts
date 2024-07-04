import { InurseRequest } from '../../../types/types';
import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { getNurseRequestPending, getNurseEmiterRequestPending } from '../../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: InurseRequest[];
  loading: boolean;
  status: number;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  startDate: string;
  endDate: string;
  sort: string;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: number) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  fetchData: (isNurse: boolean) => void;
  setEnabled: (enabled: boolean) => void;
  clearFilters: () => void;
  setSort: (sort: string) => void;
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
  startDate: '',
  endDate: '',
  sort: '',
};

export const useNurseRequestPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setStatus: (status: number) => set({ status }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setStartDate: (startDate: string) => set({ startDate, pageIndex: 0 }),
  setEndDate: (endDate: string) => set({ endDate, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  fetchData: async (isNurse: boolean) => {
    const { enabled, search, pageIndex, pageSize, status, sort } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      let res: any;
      if(isNurse){
        console.log("enfermero");
        res = await getNurseRequestPending(
          `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize
          }&search=${search}&habilitado=${enabled}&sort=${sort}`
        );
      }else{
        res = await getNurseEmiterRequestPending(
          `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize
          }&search=${search}&habilitado=${enabled}&estatus=${status}&sort=${sort}`
        );
      }
      
      console.log("weragonateikit enimor",res.data);
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
      status: 1,
      pageSize: 10,
      search: '',
      loading: true,
      startDate: '',
      endDate: '',
    });
  },
  clearData: () => {
    set({ ...initialValues });
  },
}));
