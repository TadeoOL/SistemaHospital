import { create } from 'zustand';
import axios, { CancelTokenSource } from 'axios';
import { IPatientAccount } from '../../types/admissionTypes';
import { getOutstandingBillsPagination } from '../../services/programming/patientService';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IPatientAccount[];
  loading: boolean;
  search: string;
  cancelToken: CancelTokenSource | null;
  sort: string;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setSort: (sort: string) => void;
  clearFilters: () => void;
  clearData: () => void;
}

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  loading: false,
  search: '',
  cancelToken: null as CancelTokenSource | null,
  sort: '',
};

export const useOutstandingBillsPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  fetchData: async () => {
    const { search, pageIndex, pageSize } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getOutstandingBillsPagination(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}`
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
      sort: '',
    });
  },
  clearData: () => {
    set({ ...initialValues });
  },
}));
