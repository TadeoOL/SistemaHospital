import { getDefaultPaginationParams, IPaginationParams, IPaginationResponse } from '@/types/paginationType';
import axios from '@/libs/axios';
import {
  IAdministrationFund,
  IAdministrationMovement,
  IAdministrationMovementHistory,
  ICreateAuthorizationCommand,
} from '../types/types.administration';
import { ITreasuryMovement } from '../../types/types.common';

const baseUrl = '/api/Tesoreria/Direccion';

export namespace AdministrationService {
  export const getDepositsPendingPagination = async (
    paramsUrl?: IPaginationParams
  ): Promise<IPaginationResponse<IAdministrationMovement>> => {
    const params = getDefaultPaginationParams(paramsUrl);
    const endpoint = `${baseUrl}/paginacion-depositos-pendientes`;
    const res = await axios.get(endpoint, { params });
    return res.data;
  };

  export const approveDeposit = async (id_VentaCaja: string): Promise<void> => {
    const endpoint = `${baseUrl}/crear-deposito`;
    const res = await axios.post(endpoint, { id_VentaCaja });
    return res.data;
  };

  export const getAdministrationMovementsPagination = async (
    paramsUrl?: IPaginationParams
  ): Promise<IPaginationResponse<IAdministrationMovementHistory>> => {
    const params = getDefaultPaginationParams(paramsUrl);
    const endpoint = `${baseUrl}/movimientos-direccion`;
    const res = await axios.get(endpoint, { params });
    return res.data;
  };

  export const createAuthorization = async (command: ICreateAuthorizationCommand): Promise<ITreasuryMovement> => {
    const endpoint = `${baseUrl}/crear-autorizacion-direccion`;
    const res = await axios.post(endpoint, command);
    return res.data;
  };

  export const getAdministrationFund = async (): Promise<IAdministrationFund> => {
    const endpoint = `${baseUrl}/obtener-saldo-direccion`;
    const res = await axios.get(endpoint);
    return res.data;
  };
}
