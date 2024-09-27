import { createWithEqualityFn } from 'zustand/traditional';
import { IArticlePOS, IUserSalesRegister } from '../../../types/types';
import { devtools } from 'zustand/middleware';

const initialValuesUserSalesData: IUserSalesRegister = {
  cerrada: false,
  diaHoraCorte: null,
  dineroAlCorte: null,
  fechaCreacion: '',
  id: '',
  pasoSuJornada: false,
  tieneCaja: false,
};

const initialValues = {
  articlesOnBasket: [],
  paymentMethod: 0,
  subTotal: 0,
  iva: 0,
  total: 0,
};

interface State {
  articlesOnBasket: IArticlePOS[];
  paymentMethod: number;
  subTotal: number;
  iva: number;
  total: number;
  userSalesRegisterData: IUserSalesRegister;
}

interface Action {
  setArticlesOnBasket: (articlesOnBasket: IArticlePOS[]) => void;
  setPaymentMethod: (paymentMethod: number) => void;
  setSubTotal: (subTotal: number) => void;
  setIva: (iva: number) => void;
  setTotal: (total: number) => void;
  setUserSalesRegisterData: (userSalesRegisterData: IUserSalesRegister) => void;
  clearData: () => void;
}

export const usePosOrderArticlesStore = createWithEqualityFn<State & Action>()(
  devtools((set) => ({
    ...initialValues,
    userSalesRegisterData: initialValuesUserSalesData,
    setPaymentMethod: (paymentMethod: number) => set({ paymentMethod }),
    setArticlesOnBasket: (articlesOnBasket: IArticlePOS[]) => set({ articlesOnBasket }),
    setSubTotal: (subTotal: number) => set({ subTotal }),
    setIva: (iva: number) => set({ iva }),
    setTotal: (total: number) => set({ total }),
    setUserSalesRegisterData: (userSalesRegisterData: IUserSalesRegister) => set({ userSalesRegisterData }),
    clearData: () => {
      set(initialValues);
    },
  }))
);
