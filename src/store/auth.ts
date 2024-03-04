import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types/types";

interface State {
  token: string | null;
  profile: IUser | null;
  isAuth: boolean;
}

interface Action {
  setToken: (isAuth: string) => void;
  setProfile: (user: IUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<State & Action>(
    (set) => ({
      token: null,
      isAuth: false,
      setToken: (state: string | null) =>
        set(() => ({ token: state, isAuth: true })),
      profile: null,
      setProfile: (state: IUser | null) => set(() => ({ profile: state })),
      logout: () => set(() => ({ token: "", isAuth: false, profile: null })),
    }),
    {
      name: "auth",
    }
  )
);
