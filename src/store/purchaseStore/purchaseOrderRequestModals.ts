import { createWithEqualityFn } from 'zustand/traditional';
import { IProvider, IPurchaseAuthorization, IRegisterPurchaseOrder } from '../../types/types';

interface State {
  step: number;
  providerSelected: string;
  dataOrderRequest: IPurchaseAuthorization | null;
  provider: IProvider | IProvider[] | null;
  registerOrderPurchase: IRegisterPurchaseOrder | null;
  precios: { [key: string]: string };
}

interface Action {
  setStep: (step: number) => void;
  setProviderSelected: (selected: string) => void;
  setDataOrderRequest: (dataOrderRequest: IPurchaseAuthorization | null) => void;
  setProvider: (provider: IProvider | IProvider[]) => void;
  setRegisterOrderPurchase: (registerOrderPurchase: IRegisterPurchaseOrder) => void;
  setPrecios: (precios: { [key: string]: string }) => void;
}

export const usePurchaseOrderRequestModals = createWithEqualityFn<State & Action>()((set) => ({
  step: 0,
  providerSelected: '',
  dataOrderRequest: null,
  provider: null,
  registerOrderPurchase: null,
  precios: {},
  setPrecios: (precios: { [key: string]: string }) => set({ precios }),
  setRegisterOrderPurchase: (registerOrderPurchase: IRegisterPurchaseOrder) => set({ registerOrderPurchase }),
  setProvider: (provider: IProvider | IProvider[]) => set({ provider }),
  setStep: (step: number) => set({ step }),
  setProviderSelected: (providerSelected: string) => set({ providerSelected }),
  setDataOrderRequest: (dataOrderRequest: IPurchaseAuthorization | null) => set({ dataOrderRequest }),
}));
