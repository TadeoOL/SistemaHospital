import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  search: string;
  sort: string;
  enabled: boolean;
  warehouseId: string;
}

interface Action {
  setSearch: (search: string) => void;
  setWarehouseId: (warehouseId: string) => void;
  setSort: (sort: string) => void;
  setEnabled: (enabled: boolean) => void;
}

export const useCategoryPagination = createWithEqualityFn<State & Action>((set) => ({
  search: '',
  warehouseId: '',
  sort: '',
  enabled: true,
  setSort: (sort: string) => set({ sort }),
  setSearch: (search: string) => set({ search }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setEnabled: (enabled: boolean) => set({ enabled }),
}));
