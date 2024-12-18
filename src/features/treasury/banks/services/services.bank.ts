import axios from '@/libs/axios';
import { getDefaultPaginationParams, IPaginationParams, IPaginationResponse } from '@/types/paginationType';
import { IBank, IBankFound, IBankMovements } from '../types/types.bank';
const baseUrl = 'api/Tesoreria/Banco';

export namespace BankService {
  export const getBankPagination = async (paramUrl?: IPaginationParams): Promise<IPaginationResponse<IBank>> => {
    const params = getDefaultPaginationParams(paramUrl);
    const res = await axios.get(`${baseUrl}/paginacion-banco`, { params });
    return res.data;
  };

  export const getBankFound = async (): Promise<IBankFound> => {
    const res = await axios.get(`${baseUrl}/obtener-saldo-banco`);
    return res.data;
  };

  export const getBankMovements = async (params: {
    fechaInicio: string;
    fechaFin: string;
    id_Origen: number;
    id_Destino: number;
  }): Promise<IBankMovements> => {
    const res = await axios.get(`${baseUrl}/movimientos-banco`, { params });
    return res.data;
  };
}