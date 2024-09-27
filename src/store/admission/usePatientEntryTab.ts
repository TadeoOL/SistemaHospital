import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  tabValue: number;
}

interface Action {
  setTabValue: (tabValue: number) => void;
}

export const usePatientEntryTabStore = createWithEqualityFn<State & Action>((set) => ({
  tabValue: 1,
  setTabValue: (state: number) => set(() => ({ tabValue: state })),
}));
