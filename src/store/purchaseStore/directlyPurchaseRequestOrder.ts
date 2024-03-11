import { createWithEqualityFn } from "zustand/traditional";
import { IProvider, IRegisterOrderPurchase } from "../../types/types";

// type Warehouse = {
//   id: string;
//   name: string;
// };

type ArticleOrder = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

type Article = {
  id: string;
  nombre: string;
  precio: number;
};

interface State {
  warehouseSelected: string;
  articles: ArticleOrder[] | [];
  pdf: string;
  provider: IProvider | null | IProvider[];
  step: number;
  search: string;
  articlesFetched: Article[] | [];
  isManyProviders: boolean;
  isDirectlyPurchase: boolean;
  totalAmountRequest: number;
  registerOrder: IRegisterOrderPurchase | null;
  needAuth: boolean;
}

interface Action {
  setWarehouseSelected: (warehouseSelected: string) => void;
  setArticles: (articles: ArticleOrder[]) => void;
  setPdf: (pdf: string) => void;
  setProvider: (provider: IProvider | IProvider[]) => void;
  setStep: (step: number) => void;
  setSearch: (search: string) => void;
  setArticlesFetched: (articlesFetched: Article[] | []) => void;
  setIsManyProviders: (isManyProviders: boolean) => void;
  setIsDirectlyPurchase: (isDirectlyPurchase: boolean) => void;
  setTotalAmountRequest: (totalAmountRequest: number) => void;
  clearAllStates: () => void;
  setRegisterOrder: (registerOrder: IRegisterOrderPurchase) => void;
  setNeedAuth: (needAuth: boolean) => void;
}

export const useDirectlyPurchaseRequestOrderStore = createWithEqualityFn<
  State & Action
>((set) => ({
  articles: [],
  pdf: "",
  provider: null,
  warehouseSelected: "",
  step: 0,
  search: "",
  articlesFetched: [],
  isManyProviders: false,
  isDirectlyPurchase: true,
  totalAmountRequest: 0,
  registerOrder: null,
  needAuth: false,
  setNeedAuth: (needAuth: boolean) => set({ needAuth }),
  setRegisterOrder: (registerOrder: IRegisterOrderPurchase) =>
    set({ registerOrder }),
  setWarehouseSelected: (warehouseSelected: string) =>
    set({ warehouseSelected }),
  setArticles: (articles: ArticleOrder[]) => set({ articles }),
  setPdf: (pdf: string) => set({ pdf }),
  setProvider: (provider: IProvider | IProvider[]) => set({ provider }),
  setStep: (step: number) => set({ step }),
  setSearch: (search: string) => set({ search }),
  setArticlesFetched: (articlesFetched: Article[]) => set({ articlesFetched }),
  setIsManyProviders: (isManyProviders: boolean) => set({ isManyProviders }),
  setIsDirectlyPurchase: (isDirectlyPurchase: boolean) =>
    set({ isDirectlyPurchase }),
  setTotalAmountRequest: (totalAmountRequest: number) =>
    set({ totalAmountRequest }),
  clearAllStates: () =>
    set({
      step: 0,
      warehouseSelected: "",
      articles: [],
      pdf: "",
      search: "",
      articlesFetched: [],
      isManyProviders: false,
      isDirectlyPurchase: true,
      totalAmountRequest: 0,
      provider: null,
      needAuth: false,
      registerOrder: null,
    }),
}));
