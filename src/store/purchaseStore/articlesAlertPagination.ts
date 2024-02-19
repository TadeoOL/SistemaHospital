import { createWithEqualityFn } from "zustand/traditional";
import { getArticlesAlert } from "../../api/api.routes";
import { ArticleObject, ICheckedArticles } from "../../types/types";

interface State {
  data: any[];
  isLoading: boolean;
  checkedArticles: ICheckedArticles[];
  step: number;
  isAddingMoreArticles: boolean;
  handleOpen: boolean;
  isManyProviders: boolean;
  alertArticlesChecked: string[];
  articlesPurchased: ArticleObject[];
  warehouseSelected: string;
}

interface Action {
  fetchArticlesAlert: () => Promise<void>;
  setCheckedArticles: (checkedArticles: ICheckedArticles[]) => void;
  setStep: (step: number) => void;
  setIsAddingMoreArticles: (isAddingMoreArticles: boolean) => void;
  setHandleOpen: (handleOpen: boolean) => void;
  setIsManyProviders: (isManyProviders: boolean) => void;
  setAlertArticlesChecked: (alertArticlesChecked: string[]) => void;
  setArticlesPurchased: (articlesPurchased: ArticleObject[]) => void;
  setWarehouseSelected: (warehouseSelected: string) => void;
  cleanAllData: () => void;
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
    warehouseSelected: "",
    setWarehouseSelected: (warehouseSelected: string) =>
      set({ warehouseSelected }),
    setArticlesPurchased: (articlesPurchased: ArticleObject[]) =>
      set({ articlesPurchased }),
    setAlertArticlesChecked: (alertArticlesChecked: string[]) =>
      set({ alertArticlesChecked }),
    setIsManyProviders: (isManyProviders: boolean) => set({ isManyProviders }),
    setHandleOpen: (handleOpen: boolean) => set({ handleOpen }),
    setIsAddingMoreArticles: (isAddingMoreArticles: boolean) =>
      set({ isAddingMoreArticles }),
    setStep: (step: number) => set({ step }),
    setCheckedArticles: (state: ICheckedArticles[]) => {
      set({ checkedArticles: state });
    },
    fetchArticlesAlert: async () => {
      set(() => ({ isLoading: true }));
      try {
        const res = await getArticlesAlert();
        set(() => ({
          data: res,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        set(() => ({ isLoading: false }));
      }
    },
    cleanAllData: () => {
      set(() => ({
        step: 0,
        articlesPurchased: [],
        checkedArticles: [],
        isAddingMoreArticles: false,
        warehouseSelected: "",
      }));
    },
  })
);
