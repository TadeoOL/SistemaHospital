import { createWithEqualityFn } from "zustand/traditional";
import { getArticlesAlert } from "../../api/api.routes";

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeArticlesAlert: boolean;
  checkedArticles: string[];
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeArticlesAlert: (handleChangeArticlesAlert: boolean) => void;
  fetchArticlesAlert: () => Promise<void>;
  cleanArticlesAlert: () => void;
  setCheckedArticles: (checkedArticles: string[]) => void;
}

export const useArticlesAlertPagination = createWithEqualityFn<State & Action>(
  (set, get) => ({
    count: 0,
    pageCount: 0,
    resultByPage: 0,
    pageIndex: 0,
    pageSize: 5,
    data: [],
    isLoading: true,
    search: "",
    enabled: true,
    handleChangeArticlesAlert: false,
    checkedArticles: [],
    setCheckedArticles: (checkedArticles: string[]) => set({ checkedArticles }),
    setHandleChangeArticlesAlert: (handleChangeArticlesAlert: boolean) =>
      set({ handleChangeArticlesAlert }),
    setCount: (count: number) => set({ count }),
    setPageCount: (pageCount: number) => set({ pageCount }),
    setPageIndex: (pageIndex: number) => set({ pageIndex }),
    setPageSize: (pageSize: number) => set({ pageSize }),
    setSearch: (search: string) => set({ search, pageIndex: 0 }),
    setEnabled: (enabled: boolean) => set({ enabled }),
    fetchArticlesAlert: async () => {
      const { pageIndex, pageSize, enabled, search } = get();
      set(() => ({ isLoading: true }));
      const page = pageIndex + 1;
      try {
        const res = await getArticlesAlert(
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
    cleanArticlesAlert: () => {
      set(() => ({ pageIndex: 0, pageSize: 5, enabled: true, search: "" }));
    },
  })
);
