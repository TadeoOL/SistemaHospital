import { createWithEqualityFn } from 'zustand/traditional';
import { getArticlesToSaleOnPOS } from '../../../api/api.routes';
import { IPosArticle } from '../../../types/types';

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
};

export const usePosArticlesPaginationStore = createWithEqualityFn<State & Action>((set, get) => ({
  ...initialValues,
  setPageSize: (pageSize: number) => set({ pageSize }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearch: (search: string) => set({ search, pageIndex: 1 }),
  setSubCategoryId: (subCategoryId: string) => set({ subCategoryId, pageIndex: 1 }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setFetchPagination: (fetchPagination: boolean) => set({ fetchPagination }),
  fetchData: async () => {
    set({ loading: true });
    const { enabled, search, pageIndex, pageSize, warehouseId, subCategoryId, fetchPagination, data } = get();
    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getArticlesToSaleOnPOS(
        `${pageIndex === 0 ? '' : 'pageIndex=' + pageIndex}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&id_Almacen=${warehouseId}&id_SubCategoria=${subCategoryId}`
      );

      set({
        data: fetchPagination ? [...data, ...res.data] : res.data,
        pageCount: res.pageCount,
        pageIndex: res.pageIndex,
        pageSize: res.pageSize,
        count: res.count,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false, fetchPagination: false });
    }
  },
}));
