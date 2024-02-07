import { createWithEqualityFn } from "zustand/traditional";
import { getPurchaseWarehouse } from "../../api/api.routes";

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeWarehouse: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeWarehouse: (handleChangeWarehouse: boolean) => void;
  fetchExistingArticles: (
    pageIndex: number,
    pageSize: number,
    search: string,
    enabled: boolean
  ) => Promise<void>;
}

export const useWarehousePagination = createWithEqualityFn<State & Action>(
  (set) => ({
    count: 0,
    pageCount: 0,
    resultByPage: 0,
    pageIndex: 0,
    pageSize: 5,
    data: [],
    isLoading: true,
    search: "",
    enabled: true,
    handleChangeWarehouse: false,
    setHandleChangeWarehouse: (handleChangeWarehouse: boolean) =>
      set({ handleChangeWarehouse }),
    setCount: (count: number) => set({ count }),
    setPageCount: (pageCount: number) => set({ pageCount }),
    setPageIndex: (pageIndex: number) => set({ pageIndex }),
    setPageSize: (pageSize: number) => set({ pageSize }),
    setSearch: (search: string) => set({ search, pageIndex: 0 }),
    setEnabled: (enabled: boolean) => set({ enabled }),
    fetchExistingArticles: async (
      pageIndex: number,
      pageSize: number,
      search: string,
      enabled: boolean
    ) => {
      set(() => ({ isLoading: true }));
      const page = pageIndex + 1;
      try {
        const res = await getPurchaseWarehouse(
          `${page === 0 ? "" : "pageIndex=" + page}&${
            pageSize === 0 ? "" : "pageSize=" + pageSize
          }&search=${search}&habilitado=${enabled}`
        );
        set(() => ({
          data: res.data,
          count: res.count,
          pageSize: res.pageSize,
          enabled: res.habilitado,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        set(() => ({ isLoading: false }));
      }
    },
  })
);
