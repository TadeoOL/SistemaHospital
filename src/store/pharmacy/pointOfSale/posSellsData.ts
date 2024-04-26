import { create } from 'zustand';
import { ISell } from '../../../types/types';
import { usePosOrderArticlesStore } from './posOrderArticles';
import { getSoldResume } from '../../../services/pharmacy/pointOfSaleService';
import axios, { CancelTokenSource } from 'axios';

const initialValues = {
  sells: [],
  sellStates: [],
  cancelToken: null as CancelTokenSource | null,
};

interface State {
  isLoading: boolean;
  sells: ISell[];
  sellStates: number[];
  cancelToken: CancelTokenSource | null;
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
    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });
    const { sellStates } = get();
    try {
      const checkoutId = usePosOrderArticlesStore.getState().userSalesRegisterData.id;
      const res = await getSoldResume(checkoutId, sellStates, cancelToken.token);
      set({ sells: res });
    } catch (error) {
      if (axios.isCancel(error)) {
        null;
      } else {
        console.log(error);
      }
    } finally {
      if (!cancelToken.token.reason) {
        set({ isLoading: false });
      }
    }
  },
}));
