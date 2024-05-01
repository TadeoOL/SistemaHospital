import { createWithEqualityFn } from 'zustand/traditional';
import { IProvider, IRegisterOrderPurchase } from '../../types/types';

// type Warehouse = {
//   id: string;
//   name: string;
// };

type ArticleOrder = {
  id: string;
  name: string;
  amount: number;
  price?: number;
  stock?: number;
};

type Article = {
  id: string;
  nombre: string;
  precio?: number;
};

interface State {
  warehouseSelected: string;
  articles: ArticleOrder[] | [];
  pdf: string;
  provider: IProvider | null | IProvider[];
  step: number;
  articlesFetched: Article[] | [];
  isManyProviders: boolean;
  isDirectlyPurchase: boolean;
  totalAmountRequest: number;
  registerOrder: IRegisterOrderPurchase | null;
  needAuth: boolean;
  note: string;
  openPurchaseRequestOrder: boolean;
  paymentMethod: number;
  search: string;
  hasProvider: boolean;
}

interface Action {
  setWarehouseSelected: (warehouseSelected: string) => void;
  setArticles: (articles: ArticleOrder[]) => void;
  setPdf: (pdf: string) => void;
  setProvider: (provider: IProvider | IProvider[] | null) => void;
  setStep: (step: number) => void;
  setArticlesFetched: (articlesFetched: Article[] | []) => void;
  setIsManyProviders: (isManyProviders: boolean) => void;
  setIsDirectlyPurchase: (isDirectlyPurchase: boolean) => void;
  setTotalAmountRequest: (totalAmountRequest: number) => void;
  clearAllStates: () => void;
  setRegisterOrder: (registerOrder: IRegisterOrderPurchase) => void;
  setNeedAuth: (needAuth: boolean) => void;
  setNote: (note: string) => void;
  setOpenPurchaseRequestOrder: (openPurchaseRequestOrder: boolean) => void;
  setPaymentMethod: (paymentMethod: number) => void;
  setSearch: (search: string) => void;
  setHasProvider: (hasProvider: boolean) => void;
}

export const useDirectlyPurchaseRequestOrderStore = createWithEqualityFn<State & Action>((set) => ({
  articles: [],
  pdf: '',
  provider: null,
  warehouseSelected: '',
  step: 0,
  articlesFetched: [],
  isManyProviders: false,
  isDirectlyPurchase: true,
  totalAmountRequest: 0,
  registerOrder: null,
  needAuth: false,
  note: '',
  paymentMethod: 0,
  search: '',
  hasProvider: true,
  setHasProvider: (hasProvider: boolean) => set({ hasProvider }),
  setSearch: (search: string) => set({ search }),
  setPaymentMethod: (paymentMethod: number) => set({ paymentMethod }),
  openPurchaseRequestOrder: false,
  setOpenPurchaseRequestOrder: (openPurchaseRequestOrder: boolean) => set({ openPurchaseRequestOrder }),
  setNote: (note: string) => set({ note }),
  setNeedAuth: (needAuth: boolean) => set({ needAuth }),
  setRegisterOrder: (registerOrder: IRegisterOrderPurchase) => set({ registerOrder }),
  setWarehouseSelected: (warehouseSelected: string) => set({ warehouseSelected }),
  setArticles: (articles: ArticleOrder[]) => set({ articles }),
  setPdf: (pdf: string) => set({ pdf }),
  setProvider: (provider: IProvider | IProvider[] | null) => set({ provider }),
  setStep: (step: number) => set({ step }),
  setArticlesFetched: (articlesFetched: Article[]) => set({ articlesFetched }),
  setIsManyProviders: (isManyProviders: boolean) => set({ isManyProviders }),
  setIsDirectlyPurchase: (isDirectlyPurchase: boolean) => set({ isDirectlyPurchase }),
  setTotalAmountRequest: (totalAmountRequest: number) => set({ totalAmountRequest }),
  clearAllStates: () =>
    set({
      step: 0,
      warehouseSelected: '',
      articles: [],
      pdf: '',
      articlesFetched: [],
      isManyProviders: false,
      isDirectlyPurchase: true,
      totalAmountRequest: 0,
      provider: null,
      needAuth: false,
      registerOrder: null,
      note: '',
      paymentMethod: 0,
      hasProvider: true,
    }),
}));
