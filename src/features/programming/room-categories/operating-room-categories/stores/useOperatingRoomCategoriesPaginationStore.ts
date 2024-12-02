import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  search: string;
  enabled: boolean;
}

interface Action {
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
}

export const useOperatingRoomCategoriesPaginationStore = createWithEqualityFn<State & Action>((set) => ({
  enabled: true,
  search: '',
  setEnabled: (enabled: boolean) => set({ enabled }),
  setSearch: (search: string) => set({ search }),
}));
