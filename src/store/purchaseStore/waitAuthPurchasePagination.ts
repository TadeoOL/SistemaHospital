import { createWithEqualityFn } from "zustand/traditional";
import { IPurchaseAuthorization } from "../../types/types";
import { getWaitAuthPurchase } from "../../api/api.routes";

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IPurchaseAuthorization[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChangePurchaseOrder: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChangePurchaseOrder: (handleChangePurchaseOrder: boolean) => void;
  fetchPurchaseOrders: () => Promise<void>;
  cleanPurchaseOrderData: () => void;
}

export const useWaitAuthPurchasePagination = createWithEqualityFn<
  State & Action
>((set, get) => ({
  count: 0,
  pageCount: 0,
  resultByPage: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: "",
  enabled: true,
  handleChangePurchaseOrder: false,
  setHandleChangePurchaseOrder: (handleChangePurchaseOrder: boolean) =>
    set({ handleChangePurchaseOrder }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetchPurchaseOrders: async () => {
    const { pageIndex, pageSize, enabled, search } = get();
    set(() => ({ isLoading: true }));
    const page = pageIndex + 1;
    try {
      const res = await getWaitAuthPurchase(
        `${page === 0 ? "" : "pageIndex=" + page}&${
          pageSize === 0 ? "" : "pageSize=" + pageSize
        }&search=${search}&habilitado=${enabled}`
      );
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
  cleanPurchaseOrderData: () => {
    set(() => ({ pageIndex: 0, pageSize: 5, enabled: true, search: "" }));
  },
}));
