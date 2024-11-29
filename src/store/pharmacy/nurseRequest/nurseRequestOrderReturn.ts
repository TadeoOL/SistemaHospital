import { createWithEqualityFn } from 'zustand/traditional';
import { ArticlesFromRoom } from '../../../types/hospitalization/articleRequestTypes';

interface State {
  articles: ArticlesFromRoom[] | [];
  search: string;
}

interface Action {
  setArticles: (articles: ArticlesFromRoom[]) => void;
  clearAllStates: () => void;
  setSearch: (search: string) => void;
}

export const useReturnRequestOrderStore = createWithEqualityFn<State & Action>((set) => ({
  articles: [],
  search: '',
  setSearch: (search: string) => set({ search }),
  setArticles: (articles: ArticlesFromRoom[]) => set({ articles }),
  clearAllStates: () =>
    set({
      articles: [],
      search: '',
    }),
}));
