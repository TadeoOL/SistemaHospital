import { createWithEqualityFn } from 'zustand/traditional';
import { getSubCategories } from '../../api/api.routes';

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: any[];
  isLoading: boolean;
  search: string;
  categoryId: string;
  enabled: boolean;
  sort: string;
  handleChangeSubCategory: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSort: (sort: string) => void;
  setHandleChangeSubCategory: (handleChangeSubCategory: boolean) => void;
  fetchCategories: () => Promise<void>;
}

export const useSubCategoryPagination = createWithEqualityFn<State & Action>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 10,
  data: [],
  isLoading: true,
  search: '',
  sort: '',
  categoryId:'',
  enabled: true,
  handleChangeSubCategory: false,
  setHandleChangeSubCategory: (handleChangeSubCategory: boolean) => set({ handleChangeSubCategory }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize, pageIndex: 0 }),
  setSort: (sort: string) => set({ sort }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setCategoryId: (categoryId: string) => set({ categoryId, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchCategories: async () => {
    const { pageIndex, pageSize, search, sort, enabled, categoryId } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getSubCategories(
        `${page === 0 ? '' : 'pageIndex=' + page}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&Sort=${sort}&Id_Categoria=${categoryId}`
      );
      const subCategorias = res.data.map((a: { id: any; nombre: any; descripcion: any; iva: any; categoria: any }) => {
        return {
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          iva: a.iva,
          categoria: a.categoria,
        };
      });
      set(() => ({
        data: subCategorias,
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
}));
