import { createWithEqualityFn } from "zustand/traditional";
import { getArticlesAlert } from "../../api/api.routes";

interface ArticleObject {
  id_articulo: string;
  cantidadComprar: number;
  precioInventario: number;
}
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
  step: number;
  isAddingMoreArticles: boolean;
  handleOpen: boolean;
  isManyProviders: boolean;
  alertArticlesChecked: string[];
  articlesPurchased: ArticleObject[];
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
  setStep: (step: number) => void;
  setIsAddingMoreArticles: (isAddingMoreArticles: boolean) => void;
  setHandleOpen: (handleOpen: boolean) => void;
  setIsManyProviders: (isManyProviders: boolean) => void;
  setAlertArticlesChecked: (alertArticlesChecked: string[]) => void;
  setArticlesPurchased: (articlesPurchased: ArticleObject[]) => void;
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
    step: 0,
    isAddingMoreArticles: false,
    handleOpen: false,
    isManyProviders: false,
    alertArticlesChecked: [],
    articlesPurchased: [],
    setArticlesPurchased: (articlesPurchased: ArticleObject[]) =>
      set({ articlesPurchased }),
    setAlertArticlesChecked: (alertArticlesChecked: string[]) =>
      set({ alertArticlesChecked }),
    setIsManyProviders: (isManyProviders: boolean) => set({ isManyProviders }),
    setHandleOpen: (handleOpen: boolean) => set({ handleOpen }),
    setIsAddingMoreArticles: (isAddingMoreArticles: boolean) =>
      set({ isAddingMoreArticles }),
    setStep: (step: number) => set({ step }),
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
