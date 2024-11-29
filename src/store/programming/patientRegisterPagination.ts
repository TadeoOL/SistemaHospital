import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { getPatientRegisterPagination } from '../../services/programming/admissionRegisterService';
import { IRegisterPagination } from '@/types/programming/registerTypes';
import { HospitalSpaceType } from '@/types/admission/admissionTypes';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IRegisterPagination[];
  loading: boolean;
  search: string;
  enabled: boolean;
  cancelToken: CancelTokenSource | null;
  startDate: string;
  endDate: string;
  spaceId: string;
  sort: string;
  hospitalSpaceType: HospitalSpaceType;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setSpaceId: (spaceId: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSort: (sort: string) => void;
  clearData: () => void;
  clearFilters: () => void;
  setHospitalSpaceType: (hospitalSpaceType: HospitalSpaceType) => void;
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
  spaceId: '',
  sort: '',
  hospitalSpaceType: HospitalSpaceType.OperatingRoom,
};

export const usePatientRegisterPaginationStore = create<State & Action>((set, get) => ({
  ...initialValues,
  setHospitalSpaceType: (hospitalSpaceType: HospitalSpaceType) => set({ hospitalSpaceType }),
  setSort: (sort: string) => set({ sort, pageIndex: 0 }),
  setSpaceId: (spaceId: string) => set({ spaceId }),
  setStartDate: (startDate: string) => set({ startDate }),
  setEndDate: (endDate: string) => set({ endDate }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, startDate, endDate, spaceId, sort, hospitalSpaceType } = get();
    const index = pageIndex + 1;
    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      const res = await getPatientRegisterPagination(
        `&pageIndex=${index}&${pageSize === 0 ? '' : 'pageSize=' + pageSize}&search=${search}&habilitado=${enabled}&fechaInicio=${startDate}&fechaFin=${endDate}&id_Espacio=${spaceId}&sort=${sort}&tipoEspacioHospitalario=${hospitalSpaceType}`
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
    set({ startDate: '', endDate: '', search: '', spaceId: '', hospitalSpaceType: HospitalSpaceType.OperatingRoom });
  },
}));
