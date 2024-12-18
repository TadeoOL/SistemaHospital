import { useState } from 'react';
import { useCreateDeposit } from './useCreateDeposit';
import { administrationAlerts } from '../utils/utils.alerts.administration';

interface IState {
  refreshTable: boolean;
}
interface IHandlers {
  approveDeposit: (id: string) => Promise<void>;
}
interface IUseAdministrationDeposits {
  state: IState;
  handlers: IHandlers;
}

const useAdministrationDeposits = (): IUseAdministrationDeposits => {
  const { mutate: createDeposit } = useCreateDeposit();
  const [state, setState] = useState<IState>({
    refreshTable: false,
  });

  const handlers = {
    approveDeposit: async (id: string) => {
      const res = await administrationAlerts.createDepositQuestion();
      if (res.isConfirmed) {
        createDeposit(id, {
          onSuccess: async () => {
            setState({
              ...state,
              refreshTable: !state.refreshTable,
            });
            await administrationAlerts.depositApproved();
          },
          onError: async () => {
            await administrationAlerts.depositError();
          },
        });
      }
    },
  };

  return { state, handlers };
};

export default useAdministrationDeposits;
