
/* RIP
import { createWithEqualityFn } from 'zustand/traditional';
import { IArticle2 } from '../../types/types';
import axios, { CancelTokenSource } from 'axios';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { getArticlesFromWarehouseSearch } from '../../api/api.routes';

interface State {
  data: IArticle2[];
  loading: boolean;
  search: string;
  fetchPagination: boolean;
  cancelToken: CancelTokenSource | null;
}

interface Action {
  setSearch: (search: string) => void;
  fetchData: () => void;
  setFetchPagination: (fetchPagination: boolean) => void;
}

const initialValues = {
  data: [],
  loading: false,
  search: '',
  fetchPagination: false,
  cancelToken: null as CancelTokenSource | null,
};

export const usePosArticlesPaginationStore = createWithEqualityFn<State & Action>((set, get) => ({
  ...initialValues,
  setSearch: (search: string) => set({ search }),
  setFetchPagination: (fetchPagination: boolean) => set({ fetchPagination }),
  fetchData: async () => {
    const { search, fetchPagination, data } = get();
    const warehouseId = useWarehouseTabsNavStore.getState().warehouseData.id;

    set({ loading: true });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getArticlesFromWarehouseSearch(
        search,
        warehouseId
        //&search=${search}&id_Almacen=${warehouseId}`
      );
      console.log('llamada busqueda nueva', res.data);
      set({
        data: fetchPagination ? [...data, ...res.data] : res.data,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('cancelado', error);
      } else {
        console.log(error);
      }
    } finally {
      if (!cancelToken.token.reason) {
        set({ loading: false, fetchPagination: false });
      }
    }
  },
}));*/
