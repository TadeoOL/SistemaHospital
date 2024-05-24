import { createWithEqualityFn } from 'zustand/traditional';
import { IArticle2 } from '../../../types/types';
import axios, { CancelTokenSource } from 'axios';
import { usePosTabNavStore } from './posTabNav';
import { getExistingArticles } from '../../../api/api.routes';

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
    const { enabled, search, pageIndex, pageSize, subCategoryId, fetchPagination, data } = get();
    const warehouseId = usePosTabNavStore.getState().warehouseId;

    set({ loading: true });
    // const index = pageIndex + 1;
    console.log({ pageIndex });

    const cancelToken = axios.CancelToken.source();
    if (get().cancelToken) {
      get().cancelToken?.cancel();
    }
    set({ cancelToken: cancelToken });

    try {
      if (fetchPagination) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const res = await getExistingArticles(
        `&pageIndex=${pageIndex}&${
          pageSize === 0 ? '' : 'pageSize=' + pageSize
        }&search=${search}&habilitado=${enabled}&id_Almacen=${warehouseId}&id_SubCategoria=${subCategoryId}`
      );
      console.log("res postArticlesPagination",res.data);
      const fokinshi = [
        {
          id_Articulo: 'article1',
          nombre: 'Articulo 1',
          precioCompra: 41.51,
          precioVenta: 174.34,
          lote: [
            { stock: 10, fechaCaducidad: '2024-06-01', Id_ArticuloExistente: 'lote1-1' },
            { stock: 20, fechaCaducidad: '2024-07-01', Id_ArticuloExistente: 'lote1-2' },
            { stock: 15, fechaCaducidad: '2024-08-01', Id_ArticuloExistente: 'lote1-3' },
          ],
          stockActual: '45',
          cantidad: '45',
          codigoBarras: '1234567890123',
        },
        {
          id_Articulo: 'article2',
          nombre: 'Articulo 2',
          precioCompra: 104.02,
          precioVenta: 312.06,
          lote: [
            { stock: 5, fechaCaducidad: '2024-06-10', Id_ArticuloExistente: 'lote2-1' },
            { stock: 7, fechaCaducidad: '2024-07-10', Id_ArticuloExistente: 'lote2-2' },
            { stock: 1, fechaCaducidad: '2024-08-10', Id_ArticuloExistente: 'lote2-3' },
          ],
          stockActual: '13',
          cantidad: '13',
          codigoBarras: '9876543210987',
        },
        {
          id_Articulo: 'article3',
          nombre: 'Articulo 3',
          precioCompra: 7.17,
          precioVenta: 30.11,
          lote: [
            { stock: 3, fechaCaducidad: '2024-05-15', Id_ArticuloExistente: 'lote3-1' },
            { stock: 4, fechaCaducidad: '2024-06-15', Id_ArticuloExistente: 'lote3-2' },
            { stock: 5, fechaCaducidad: '2024-07-15', Id_ArticuloExistente: 'lote3-3' },
          ],
          stockActual: '12',
          cantidad: '12',
          codigoBarras: '4567890123456',
        },
      ];
      res.data = fokinshi; 
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
