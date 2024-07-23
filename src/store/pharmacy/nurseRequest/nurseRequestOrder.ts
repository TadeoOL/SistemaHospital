import { createWithEqualityFn } from 'zustand/traditional';

type ArticleOrder = {
  id: string;
  name: string;
  amount: number;
  stock?: number;
};

type Article = {
  id: string;
  nombre: string;
};

interface State {
  articles: ArticleOrder[] | [];
  warehouseSelected: string;
  articlesFetched: Article[] | [];
  note: string;
  search: string;
}

interface Action {
  setArticles: (articles: ArticleOrder[]) => void;
  setWarehouseSelected: (warehouseSelected: string) => void;
  setArticlesFetched: (articlesFetched: Article[] | []) => void;
  clearAllStates: () => void;
  setNote: (note: string) => void;
  setSearch: (search: string) => void;
}

export const useRequestOrderStore = createWithEqualityFn<State & Action>((set) => ({
  articles: [],
  articlesFetched: [],
  warehouseSelected: '',
  note: '',
  search: '',
  hasProvider: true,
  setSearch: (search: string) => set({ search }),
  setWarehouseSelected: (warehouseSelected: string) => set({ warehouseSelected }),
  openPurchaseRequestOrder: false,
  setNote: (note: string) => set({ note }),
  setArticles: (articles: ArticleOrder[]) => set({ articles }),
  setArticlesFetched: (articlesFetched: Article[]) => set({ articlesFetched }),
  clearAllStates: () =>
    set({
      articles: [],
      warehouseSelected: '',
      articlesFetched: [],
      note: '',
    }),
}));
