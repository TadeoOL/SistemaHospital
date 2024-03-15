import { createWithEqualityFn } from "zustand/traditional";

interface IAppNav {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAppNavStore = createWithEqualityFn<IAppNav>((set) => {
  return {
    open: false,
    setOpen: (state: boolean) => set(() => ({ open: state })),
  };
});
