import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { getDailyOperatingRooms } from '../../services/operatingRoom/dailyOperatingRoomService';
import { getTodayAndYesterdayDates } from '../../utils/functions/dataUtils';
import { IRoomInformationnew } from '../../types/operatingRoom/operatingRoomTypes';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IRoomInformationnew[];
  loading: boolean;
  search: string;
  enabled: boolean;
  status: number | null;
  cancelToken: CancelTokenSource | null;
  operatingRoomId: string;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: number | null) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  clearData: () => void;
  setOperatingRoomId: (operatingRoomId: string) => void;
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
  status: null,
  cancelToken: null as CancelTokenSource | null,
  operatingRoomId: '',
};

export const useDailyOperatingRoomsPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setOperatingRoomId: (operatingRoomId: string) => set({ operatingRoomId }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setStatus: (status: number | null) => set({ status}),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, operatingRoomId, status } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const dates = getTodayAndYesterdayDates();
      const res = await getDailyOperatingRooms(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search
        }&habilitado=${enabled}&Id_Quirofano=${operatingRoomId}&fechaInicio=${dates.fechaInicio 
        }&fechaFin=${dates.fechaFin}&Estatus=${status? status : ''}`
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
