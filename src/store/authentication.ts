import { create } from "zustand";

interface IAuthentication {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}
export const useIsAuthStore = create<IAuthentication>((set) => {
  return {
    isAuth: false,
    setIsAuth: (state: boolean) => set(() => ({ isAuth: state })),
  };
});
