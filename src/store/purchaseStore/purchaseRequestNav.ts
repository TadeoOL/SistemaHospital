import { createWithEqualityFn } from "zustand/traditional";

interface State {
  tabValue: number;
}

interface Action {
  setTabValue: (value: number) => void;
}

export const usePurchaseRequestNav = createWithEqualityFn<State & Action>(
  (set) => ({
    tabValue: 0,
    setTabValue: (state: number) => set(() => ({ tabValue: state })),
  })
);
