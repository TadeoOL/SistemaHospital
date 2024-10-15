import { createWithEqualityFn } from 'zustand/traditional';
import { IExistingArticle } from '../../types/types';
import { debouncedSetSearch, getFirstDayOfTheMonth } from '../../utils/functions/dataUtils';
import { getExistingArticles } from '../../services/warehouse/articleWarehouseService';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IExistingArticle[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangeExistingArticle: boolean;
  warehouseId: string;
  principalWarehouseId: string;
  startDate: string;
  subcategory: string;
  endDate: string;
  sort: string;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => void;
  fetchExistingArticles: () => Promise<void>;
  setWarehouseId: (warehouseId: string) => void;
  setPrincipalWarehouseId: (principalWarehouseId: string) => void;
  setStartDate: (startDate: string) => void;
  setSubcategory: (subcategory: string) => void;
  setEndDate: (endDate: string) => void;
  clearFilters: () => void;
  clearAllData: () => void;
  setSort: (sort: string) => void;
}

const initialState: State = {
  count: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  enabled: true,
  handleChangeExistingArticle: false,
  warehouseId: '',
  principalWarehouseId: '',
  startDate: getFirstDayOfTheMonth(),
  subcategory: '',
  endDate: '',
  sort: '',
};
export const useExistingArticlePagination = createWithEqualityFn<State & Action>((set, get) => ({
  ...initialState,
  setStartDate: (startDate: string) => set({ startDate }),
  setSubcategory: (subcategory: string) => set({ subcategory }),
  setEndDate: (endDate: string) => set({ endDate }),
  setWarehouseId: (warehouseId: string) => set({ warehouseId }),
  setPrincipalWarehouseId: (principalWarehouseId: string) => set({ principalWarehouseId }),
  setHandleChangeExistingArticle: (handleChangeExistingArticle: boolean) => set({ handleChangeExistingArticle }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSort: (sort: string) => set({ sort }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSearch: (search: string) => debouncedSetSearch(set, search),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchExistingArticles: async () => {
    set(() => ({ isLoading: true }));
    const {
      pageIndex,
      pageSize,
      search,
      enabled,
      warehouseId,
      startDate,
      subcategory,
      endDate,
      sort,
      principalWarehouseId,
    } = get();
    const page = pageIndex + 1;
    try {
      let mainWarehouseId = '';
      if (warehouseId === '') return;
      if (principalWarehouseId === '') {
        mainWarehouseId = warehouseId;
      } else {
        mainWarehouseId = principalWarehouseId;
      }
      const res = await getExistingArticles(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Id_Almacen=${warehouseId}&Id_SubCategoria=${
          subcategory }&Id_AlmacenPrincipal=${mainWarehouseId}&fechaInicio=${startDate}&fechaFin=${endDate}&sort=${sort}&EsSubAlmacen=${
            principalWarehouseId !== ''
          }`
      );
      set(() => ({
        data: res.data,
        count: res.count,
        pageSize: res.pageSize,
        enabled: res.habilitado,
        pageCount: res.pageCount,
        //pageIndex: res.pageIndex,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  clearFilters: () => {
    set({
      pageCount: 0,
      pageIndex: 0,
      pageSize: 10,
      search: '',
      isLoading: true,
      startDate: '',
      endDate: '',
      subcategory: '',
    });
  },
  clearAllData: () => {
    set(initialState);
  },
}));
