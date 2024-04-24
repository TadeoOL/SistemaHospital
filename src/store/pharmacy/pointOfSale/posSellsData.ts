import { create } from 'zustand';
import { ISell } from '../../../types/types';
import { usePosOrderArticlesStore } from './posOrderArticles';
import { getSoldResume } from '../../../services/pharmacy/pointOfSaleService';

const initialValues = {
  sells: [],
  sellStates: [],
};

interface State {
  isLoading: boolean;
  sells: ISell[];
  sellStates: number[];
}

interface Action {
  setSells: (sells: ISell[]) => void;
  fetchSells: () => void;
  setSellStates: (sellStates: number[]) => void;
}

export const usePosSellsDataStore = create<State & Action>((set, get) => ({
  ...initialValues,
  isLoading: true,
  setSells: (sells: ISell[]) => set({ sells }),
  setSellStates: (sellStates: number[]) => set({ sellStates }),
  fetchSells: async () => {
    set({ isLoading: true });
    const { sellStates } = get();
    try {
      const checkoutId = usePosOrderArticlesStore.getState().userSalesRegisterData.id;
      const res = await getSoldResume(checkoutId, sellStates);
      set({ sells: res });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
