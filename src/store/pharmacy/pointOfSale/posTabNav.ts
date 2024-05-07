import { create } from 'zustand';

interface State {
  tabValue: number;
  warehouseId: string;
}

interface Action {
  setTabValue: (tabValue: number) => void;
  setWarehouseId: (warehouseId: string) => void;
}

export const usePosTabNavStore = create<State & Action>((set) => ({
  tabValue: 0,
  warehouseId: '',
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setTabValue: (tabValue: number) => set({ tabValue }),
}));
