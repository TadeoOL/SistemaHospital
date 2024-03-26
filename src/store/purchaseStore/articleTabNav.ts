import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  tabValue: number;
}

interface Action {
  setTabValue: (tabValue: number) => void;
}

export const useArticleTabNav = createWithEqualityFn<State & Action>((set) => ({
  tabValue: 0,
  setTabValue: (state: number) => set(() => ({ tabValue: state })),
}));
