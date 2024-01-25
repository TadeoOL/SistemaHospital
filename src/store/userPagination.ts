import { create } from "zustand";
import { getUsers } from "../api/api.routes";

interface State {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  loading: boolean;
  search: string;
  enabled: boolean;
}

interface Action {
  searchPagination: (search: string) => void;
  setPageIndex: (pageIndex: number) => void;
  setResultByPage: (setResultByPage: number) => void;
  fetchData: (
    pageSize: number,
    search: string,
    enabled: boolean,
    pageIndex: number
  ) => Promise<void>;
}

export const useUserPaginationStore = create<State & Action>((set) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  loading: false,
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  telefono: "",
  email: "",
  search: "",
  enabled: true,
  searchPagination: (state: string) =>
    set(() => ({ search: state, pageIndex: 0 })),
  setPageIndex: (state: number) => set(() => ({ pageIndex: state })),
  setResultByPage: (state: number) => set(() => ({ pageSize: state })),
  fetchData: async (
    pageSize: number,
    search: string,
    enabled: boolean,
    pageIndex: number
  ) => {
    set(() => ({ loading: true }));
    try {
      const page = pageIndex + 1;
      const res = await getUsers(
        `${page === 0 ? "" : "pageIndex=" + page}&${
          pageSize === 0 ? "" : "pageSize=" + pageSize
        }&search=${search}&habilitado=${enabled}`
      );
      set(() => ({
        data: res.data,
        loading: false,
        count: res.count,
        pageSize: res.pageSize,
        pageCount: res.pageCount,
        resultByPage: res.resultByPage,
      }));
    } catch (error) {
      console.error({ error });
      set(() => ({ loading: false }));
    }
  },
}));
