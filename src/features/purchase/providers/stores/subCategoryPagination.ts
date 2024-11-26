import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  search: string;
  categoryId: string;
  enabled: boolean;
  sort: string;
}

interface Action {
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSort: (sort: string) => void;
}

export const useSubCategoryPagination = createWithEqualityFn<State & Action>((set) => ({
  search: '',
  sort: '',
  categoryId: '',
  enabled: true,
  setSort: (sort: string) => set({ sort }),
  setSearch: (search: string) => set({ search }),
  setCategoryId: (categoryId: string) => set({ categoryId }),
  setEnabled: (enabled: boolean) => set({ enabled }),
}));
