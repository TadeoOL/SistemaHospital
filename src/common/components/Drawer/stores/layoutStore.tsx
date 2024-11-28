import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  drawerOpen: boolean;
}

interface Action {
  setDrawerOpen: (drawerOpen: boolean) => void;
}

export const useLayoutStore = createWithEqualityFn<State & Action>((set) => ({
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
}));
