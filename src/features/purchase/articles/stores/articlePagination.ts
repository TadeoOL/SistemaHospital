import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  subcategory: string;
  warehouseSelected: string | null;
  search: string;
  enabled: boolean;
}

interface Action {
  setSubcategory: (subcategory: string) => void;
  setWarehouseSelected: (warehouseSelected: string | null) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
}

export const useArticlePagination = createWithEqualityFn<State & Action>((set) => ({
  enabled: true,
  search: '',
  subcategory: '',
  warehouseSelected: '', //harcodeo insano de farmacia
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setSearch: (search: string) => set({ search }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setWarehouseSelected: (warehouseSelected: string | null) => set({ warehouseSelected }),
}));
