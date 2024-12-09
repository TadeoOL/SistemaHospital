import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  search: string;
  enabled: boolean;
}

interface Action {
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
}

export const useWarehousePagination = createWithEqualityFn<State & Action>((set) => ({
  search: '',
  enabled: true,
  setSearch: (search: string) => set({ search }),
  setEnabled: (enabled: boolean) => set({ enabled }),
}));
