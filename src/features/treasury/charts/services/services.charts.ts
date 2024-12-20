import { IMovements, SellsAndMovementsAdministration } from '../types/types.charts';
import axios from '@/libs/axios';

const baseUrl = '/api/Tesoreria/Grafica';

export namespace ChartsService {
  export const getAdministrationSellsAndMovements = async (): Promise<SellsAndMovementsAdministration> => {
    const endpoint = `${baseUrl}/informacion-ventas-direccion`;
    const res = await axios.get(endpoint);
    return res.data;
  };

  export const getBankMovements = async (params: {
    fechaInicio: string;
    fechaFin: string;
    id_Origen: number;
    id_Destino: number;
  }): Promise<IMovements> => {
    const res = await axios.get(`${baseUrl}/movimientos-banco`, { params });
    return res.data;
  };

  export const getBoxMovements = async (params: {
    fechaInicio: string;
    fechaFin: string;
    id_CajaRevolvente: string;
    esSemanal: boolean;
  }): Promise<IMovements> => {
    const res = await axios.get(`${baseUrl}/movimientos-caja`, { params });
    return res.data;
  };
}
