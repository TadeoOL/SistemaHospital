import { useState } from 'react';
import { useCreateApproveBankPurchase } from './useCreateApproveBankPurchase';
import { alertsBankPurchase } from '../utils/alerts/utils.alerts.bank';

const initialState: State = {
  refresh: false,
};

interface State {
  refresh: boolean;
}

interface Handlers {
  refresh: () => void;
  approveBankPurchase: (id_MovimientoTesoreria: string) => void;
}

export const useBankPurchases = (): [State, Handlers] => {
  const [state, setState] = useState<State>(initialState);
  const { mutate: approveBankPurchase } = useCreateApproveBankPurchase();

  const handlers: Handlers = {
    refresh: () => {
      setState((prev) => ({ ...prev, refresh: !prev.refresh }));
    },
    approveBankPurchase: async (id_MovimientoTesoreria: string) => {
      const result = await alertsBankPurchase.approve();
      if (result.isConfirmed) {
        approveBankPurchase(id_MovimientoTesoreria, {
          onSuccess: () => {
            alertsBankPurchase.approved();
          },
          onError: (error: any) => {
            alertsBankPurchase.error(error.response.data.message[0]);
          },
        });
      } else {
        alertsBankPurchase.cancelled();
      }
    },
  };

  return [state, handlers];
};
