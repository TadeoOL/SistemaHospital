import { createWithEqualityFn } from "zustand/traditional";
import { getPurchaseOrderRequest } from "../../api/api.routes";
import { IPurchaseAuthorization } from "../../types/types";

interface State {
  count: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  data: IPurchaseAuthorization[];
  isLoading: boolean;
  search: string;
  enabled: boolean;
  handleChange: boolean;
}

interface Action {
  setCount: (count: number) => void;
  setPageCount: (pageCount: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setEnabled: (enabled: boolean) => void;
  setHandleChange: (handleChange: boolean) => void;
  fetch: () => Promise<void>;
}

export const usePurchaseOrderRequestPagination = createWithEqualityFn<
  State & Action
>()((set, get) => ({
  count: 0,
  pageCount: 0,
  pageIndex: 0,
  pageSize: 5,
  data: [],
  isLoading: true,
  search: "",
  enabled: true,
  handleChange: false,
  setHandleChange: (handleChange: boolean) => set({ handleChange }),
  setCount: (count: number) => set({ count }),
  setPageCount: (pageCount: number) => set({ pageCount }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSearch: (search: string) => set({ search, pageIndex: 0 }),
  setEnabled: (enabled: boolean) => set({ enabled }),
  fetch: async () => {
    set(() => ({ isLoading: true }));
    const { pageIndex, pageSize, search, enabled } = get();
    const page = pageIndex + 1;
    try {
      const res = await getPurchaseOrderRequest(
        `${page === 0 ? "" : "pageIndex=" + page}&${
          pageSize === 0 ? "" : "pageSize=" + pageSize
        }&search=${search}&habilitado=${enabled}`
      );
      console.log({ res });
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
}));
