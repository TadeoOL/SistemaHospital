import { create } from 'zustand';

interface State {
  tabValue: number;
}

interface Action {
  setTabValue: (tabValue: number) => void;
}

export const useInvoiceTabStore = create<State & Action>((set) => ({
  tabValue: 1,
  setTabValue: (state: number) => set(() => ({ tabValue: state })),
}));
