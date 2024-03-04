import { create } from "zustand";

interface IAppNav {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAppNavStore = create<IAppNav>((set) => {
  return {
    open: false,
    setOpen: (state: boolean) => set(() => ({ open: state })),
  };
});
