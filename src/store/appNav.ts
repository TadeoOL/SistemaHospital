import { create } from "zustand";

interface IAppNav {
  dopen: boolean;
}

interface Action {
  updateOpen: (dopen: IAppNav["dopen"]) => void;
}
export const useAppNavStore = create<IAppNav & Action>((set) => {
  return {
    dopen: false,
    updateOpen: (dopen) => set(() => ({ dopen: dopen })),
  };
});
