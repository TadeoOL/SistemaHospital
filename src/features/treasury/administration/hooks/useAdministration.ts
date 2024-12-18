import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAdministrationFund } from '../types/types.administration';
import { useGetAdministrationFund } from './useGetAdministrationFund';
import { AuthorizationSchema } from '../schema/schema.administration';
import { useCreateAdministrationAuthorization } from './useCreateAuthorization';
import { toast } from 'react-toastify';

const initialFund: IAdministrationFund = {
  saldo: 0,
  cantidadVentas: 0,
};

interface IState {
  openAuthorizationModal: boolean;
  fund: IAdministrationFund;
}
interface IHandlers {
  openAuthorizationModal: () => void;
  closeAuthorizationModal: () => void;
  navigateToDeposits: () => void;
  navigateToMovements: () => void;
  createAuthorization: (data: AuthorizationSchema) => void;
}
interface IUseAdministration {
  state: IState;
  handlers: IHandlers;
}

const useAdministration = (): IUseAdministration => {
  const navigation = useNavigate();
  const { mutate: createAuthorization } = useCreateAdministrationAuthorization();
  const { data: fundRes } = useGetAdministrationFund();
  const [state, setState] = useState<IState>({
    openAuthorizationModal: false,
    fund: fundRes ?? initialFund,
  });

  useEffect(() => {
    if (fundRes) {
      setState({
        ...state,
        fund: fundRes,
      });
    }
  }, [fundRes]);

  const handlers = {
    openAuthorizationModal: () => {
      setState({
        ...state,
        openAuthorizationModal: true,
      });
    },
    closeAuthorizationModal: () => {
      setState({
        ...state,
        openAuthorizationModal: false,
      });
    },
    navigateToDeposits: () => {
      navigation('/tesoreria/direccion/depositos');
    },
    navigateToMovements: () => {
      navigation('/tesoreria/direccion/movimientos');
    },
    createAuthorization: (data: AuthorizationSchema) => {
      createAuthorization(data, {
        onSuccess: () => {
          handlers.closeAuthorizationModal();
          toast.success('Autorización creada correctamente');
        },
        onError: (error) => {
          console.log(error);
          toast.error('Error al crear la autorización');
        },
      });
    },
  };

  return { state, handlers };
};

export default useAdministration;
