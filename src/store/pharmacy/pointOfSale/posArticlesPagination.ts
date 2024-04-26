import { createWithEqualityFn } from 'zustand/traditional';
import { IPosArticle } from '../../../types/types';
import { getArticlesToSaleOnPOS } from '../../../services/pharmacy/pointOfSaleService';
import axios, { CancelTokenSource } from 'axios';

interface State {
  count: number;
  pageCount: number;
  resultByPage: number;
  pageIndex: number;
  pageSize: number;
  data: IPosArticle[];
  loading: boolean;
  search: string;
  enabled: boolean;
  warehouseId: string;
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
  setWarehouseId: (warehouseId: string) => void;
  setSubCategoryId: (subCategoryId: string) => void;
  setFetchPagination: (fetchPagination: boolean) => void;
}

const initialValues = {
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 30,
  data: [],
  loading: false,
  enabled: true,
  search: '',
  warehouseId: 'fc6d0fdd-8cfa-49a7-863e-206a7542a5e5',
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
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setSubCategoryId: (subCategoryId: string) => set({ subCategoryId, pageIndex: 0 }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setFetchPagination: (fetchPagination: boolean) => set({ fetchPagination }),
  fetchData: async () => {
    const { enabled, search, pageIndex, pageSize, warehouseId, subCategoryId, fetchPagination, data } = get();

    set({ loading: true });
    const index = pageIndex + 1;

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getArticlesToSaleOnPOS(
        `&pageIndex=${index}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&id_Almacen=${warehouseId}&id_SubCategoria=${subCategoryId}`
      );

      set({
        data: fetchPagination ? [...data, ...res.data] : res.data,
        pageSize: res.pageSize,
        count: res.count,
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
