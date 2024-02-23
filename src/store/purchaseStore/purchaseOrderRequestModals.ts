import { createWithEqualityFn } from "zustand/traditional";
import { IPurchaseAuthorization } from "../../types/types";

interface State {
  step: number;
  providerSelected: string;
  dataOrder: IPurchaseAuthorization | null;
}

interface Action {
  setStep: (step: number) => void;
  setProviderSelected: (selected: string) => void;
  setDataOrder: (dataOrder: IPurchaseAuthorization | null) => void;
}

export const usePurchaseOrderRequestModals = createWithEqualityFn<
  State & Action
>()((set) => ({
  step: 0,
  setStep: (step: number) => set({ step }),
  providerSelected: "",
  setProviderSelected: (providerSelected: string) => set({ providerSelected }),
  dataOrder: null,
  setDataOrder: (dataOrder: IPurchaseAuthorization | null) =>
    set({ dataOrder }),
}));
