import { create } from "zustand";
import { IUser } from "../types/types";

interface UserStore {
  user: IUser | null;
}

type Actions = {
  setUser: (user: IUser) => void;
};

export const useUserInfoStore = create<UserStore & Actions>((set) => {
  return {
    user: null,
    setUser: (state: IUser) => set(() => ({ user: state })),
  };
});
