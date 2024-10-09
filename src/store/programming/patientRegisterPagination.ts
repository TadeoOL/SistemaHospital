import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { getPatientRegisterPagination } from '../../services/programming/admissionRegisterService';
import { IPatientRegisterPagination } from '../../types/admissionTypes';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IPatientRegisterPagination[];
  loading: boolean;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  startDate: string;
  endDate: string;
  operatingRoomFilter: string;
  sort: string;
  accountStatus: string;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setOperatingRoomFilter: (operatingRoomFilter: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSort: (sort: string) => void;
  clearData: () => void;
  clearFilters: () => void;
  setAccountStatus: (accountStatus: string) => void;
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
  operatingRoomFilter: '',
  sort: '',
  accountStatus: '1',
};

export const usePatientRegisterPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setAccountStatus: (accountStatus: string) => set({ accountStatus }),
  setSort: (sort: string) => set({ sort, pageIndex: 0 }),
  setOperatingRoomFilter: (operatingRoomFilter: string) => set({ operatingRoomFilter }),
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, startDate, endDate, operatingRoomFilter, sort, accountStatus } =
      get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getPatientRegisterPagination(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}&habilitado=${enabled}&fechaInicio=${startDate}&fechaFin=${endDate}&quirofano=${operatingRoomFilter}&sort=${sort}&EstatusCuentaPaciente=${accountStatus}`
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
  clearFilters: () => {
    set({ startDate: '', endDate: '', search: '', operatingRoomFilter: '', accountStatus: '1' });
  },
}));
