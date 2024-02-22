import { createWithEqualityFn } from "zustand/traditional";

interface State {
  step: number;
}

interface Action {
  setStep: (step: number) => void;
}

export const usePurchaseOrderRequestModals = createWithEqualityFn<
  State & Action
>()((set) => ({
  step: 0,
  setStep: (step: number) => set({ step }),
}));
