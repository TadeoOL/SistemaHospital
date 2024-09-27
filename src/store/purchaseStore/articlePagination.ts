import { createWithEqualityFn } from 'zustand/traditional';
import { getArticles } from '../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  sort: string;
  enabled: boolean;
  handleChangeArticle: boolean;
  subcategory: string;
  warehouseSelected: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setEnabled: (enabled: boolean) => void;
  setWarehouseSelected: (warehouseSelected: string) => void;
  setHandleChangeArticle: (handleChangeArticle: boolean) => void;
  fetchArticles: (idWarehouse?: string) => Promise<void>;
  setSubcategory: (subcategory: string) => void;
  cleanArticles: () => void;
}

export const useArticlePagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  subcategory: '',
  sort: '',
  warehouseSelected: 'fc6d0fdd-8cfa-49a7-863e-206a7542a5e5', //harcodeo insano de farmacia
  enabled: true,
  handleChangeArticle: false,
  setHandleChangeArticle: (handleChangeArticle: boolean) => set({ handleChangeArticle }),
  setCount: (count: number) => set({ count }),
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  setWarehouseSelected: (warehouseSelected: string) => set({ warehouseSelected }),
  fetchArticles: async () => {
    const { pageIndex, pageSize, enabled, search, sort, warehouseSelected, subcategory } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getArticles(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&sort=${sort}&habilitado=${
          enabled
        }&id_AlmacenPrincipal=${warehouseSelected}&id_Almacen=${warehouseSelected}&Id_Subcategoria=${subcategory}`
      );
      console.log('llamada', res);
      set(() => ({
        data: res.data,
        count: res.count,
        pageSize: res.pageSize,
        enabled: res.habilitado,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  cleanArticles: () => {
    set(() => ({ pageIndex: 0, pageSize: 10, enabled: true, search: '', subcategory: '' }));
  },
}));
