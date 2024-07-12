import { createWithEqualityFn } from 'zustand/traditional';
import { IArticle2 } from '../../../types/types';
import axios, { CancelTokenSource } from 'axios';
import { usePosTabNavStore } from './posTabNav';
import { getExistingArticlesPOS } from '../../../services/pharmacy/pointOfSaleService';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IArticle2[];
  loading: boolean;
  search: string;
  enabled: boolean;
  subCategoryId: string;
  fetchPagination: boolean;
  cancelToken: CancelTokenSource | null;
}

interface Action {
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  fetchData: () => void;
  setEnabled: (enabled: boolean) => void;
  setSubCategoryId: (subCategoryId: string) => void;
  setFetchPagination: (fetchPagination: boolean) => void;
}

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 1,
  pageSize: 30,
  data: [],
  loading: false,
  enabled: true,
  search: '',
  subCategoryId: '',
  fetchPagination: false,
  cancelToken: null as CancelTokenSource | null,
};

export const usePosArticlesPaginationStore = createWithEqualityFn<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 1 }),
  setSubCategoryId: (subCategoryId: string) => set({ subCategoryId, pageIndex: 1 }),
  setFetchPagination: (fetchPagination: boolean) => set({ fetchPagination }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, fetchPagination, data, subCategoryId } = get();
    const warehouseId = usePosTabNavStore.getState().warehouseId;

    set({ loading: true });
    // const index = pageIndex + 1;

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getExistingArticlesPOS(
        `&pageIndex=${pageIndex}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&id_Almacen=${warehouseId
        }&id_AlmacenPrincipal=${warehouseId}&Id_SubCategoria=${subCategoryId}`
      )

      set({
        data: fetchPagination ? [...data, ...res.data] : res.data,
        pageSize: res.pageSize,
        count: res.count,
        pageCount: res.pageCount,
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
}));
