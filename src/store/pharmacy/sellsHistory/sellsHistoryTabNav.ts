import { create } from 'zustand';

const initialValues = {
  tabValue: 1,
};

interface State {
  tabValue: number;
}

interface Action {
  setTabValue: (tabValue: number) => void;
}

export const useSellsHistoryTabNavStore = create<State & Action>((set) => ({
  ...initialValues,
  setTabValue: (state: number) => set(() => ({ tabValue: state })),
}));
