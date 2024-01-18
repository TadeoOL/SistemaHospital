import { create } from "zustand";

interface IChildrenNavItems {
  open: boolean;
}

interface Action {
  setIsOpen: (open: IChildrenNavItems["open"]) => void;
}
export const useChildrenNavItems = create<IChildrenNavItems & Action>((set) => {
  return {
    open: true,
    setIsOpen: (open) => set(() => ({ open: open })),
  };
});
