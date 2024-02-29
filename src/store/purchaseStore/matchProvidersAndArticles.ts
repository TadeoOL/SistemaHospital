import { createWithEqualityFn } from "zustand/traditional";
import { IPurchaseAuthorization } from "../../types/types";

export type ProvidersMatched = {
  purchaseRequestId: string;
  purchaseOrder:
    | {
        providerId: string;
        article:
          | { articleId: string; purchasePrice: number; amount: number }[]
          | null;
      }[]
    | null;
};

export type PurchaseOrder = {
  providerId: string;
  article: { articleId: string; purchasePrice: number; amount: number }[];
}[];

interface State {
  purchaseRequestData: IPurchaseAuthorization | null;
  formattedData: ProvidersMatched | null;
  purchaseOrderMatched: PurchaseOrder | null;
}

interface Action {
  setPurchaseRequestData: (
    purchaseRequestData: IPurchaseAuthorization | null
  ) => void;
  setFormattedData: (formattedData: ProvidersMatched | null) => void;
  setPurchaseOrderMatched: (purchaseOrderMatched: PurchaseOrder | null) => void;
}

export const useMatchProvidersAndArticles = createWithEqualityFn<
  State & Action
>((set) => ({
  purchaseRequestData: null,
  formattedData: null,
  purchaseOrderMatched: null,
  setPurchaseOrderMatched: (purchaseOrderMatched: PurchaseOrder | null) =>
    set({ purchaseOrderMatched }),
  setFormattedData: (formattedData: ProvidersMatched | null) =>
    set({ formattedData }),
  setPurchaseRequestData: (
    purchaseRequestData: IPurchaseAuthorization | null
  ) => set({ purchaseRequestData }),
}));
